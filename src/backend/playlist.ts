import { logger } from "react-native-logs";

import User from "@backend/user";
import Backend from "@backend/backend";
import { usePlaylists, useUser } from "@backend/stores";
import { OwnedPlaylist, PlaylistInfo, TrackInfo } from "@backend/types";

const log = logger.createLogger();

/**
 * Changes the internal state of the playlist store.
 *
 * @param playlist The playlist to modify.
 */
function modifyPlaylist(playlist: OwnedPlaylist): void {
    let playlists = Object.values(usePlaylists.getState());
    const index = playlists.findIndex(p => p.id == playlist.id);
    if (index != -1) {
        playlists[index] = playlist;
        usePlaylists.setState(playlists);
    } else {
        playlists.push(playlist);
        usePlaylists.setState(playlists);
    }
}

/**
 * Fetches a playlist using its ID.
 * Can return null if the playlist is private.
 *
 * @param id The ID of the playlist to fetch.
 */
async function fetchPlaylist(id: string): Promise<OwnedPlaylist | null> {
    const response = await fetch(`${Backend.getBaseUrl()}/playlist/${id}`, {
        cache: "no-cache", headers: { authorization: await User.getToken() }
    });

    if (response.status != 301) {
        log.error("Failed to fetch playlist", response.status);
        return null;
    }

    try {
        return (await response.json()) as OwnedPlaylist;
    } catch (error) {
        log.error("Failed to fetch playlist", error);
        return null;
    }
}

/**
 * Finds the playlist in the existing playlist store.
 * If it doesn't exist, it will reach out to the server.
 *
 * @param id The ID of the playlist to find.
 */
async function findPlaylist(id: string): Promise<OwnedPlaylist | null> {
    const playlists = Object.values(usePlaylists.getState());

    let playlist = playlists.find(p => p.id == id) ?? null;
    if (!playlist) {
        playlist = await fetchPlaylist(id);
    }

    return playlist;
}

/**
 * Internal method for editing a playlist.
 *
 * @param playlistId The ID of the playlist.
 * @param body The body to send.
 * @param type The type of edit to perform.
 */
async function _editPlaylist(playlistId: string, body: any, type: string): Promise<Response> {
    return fetch(`${Backend.getBaseUrl()}/playlist/${playlistId}?type=${type}`, {
        method: "PATCH", headers: {
            "Content-Type": "application/json", authorization: await User.getToken()
        },
        body: JSON.stringify(body)
    });
}

/**
 * Edits a playlist using the provided information.
 *
 * @param playlist The playlist object to edit.
 */
async function editPlaylist(playlist: {
    id: string;
    owner?: string;
    name?: string;
    description?: string;
    icon?: string;
    isPrivate?: boolean;
    tracks?: any[];
}): Promise<boolean> {
    // If all props are set, bulk edit the playlist.
    if (playlist.id && playlist.owner && playlist.name &&
        playlist.description && playlist.icon &&
        playlist.isPrivate !== undefined && playlist.tracks) {
        const response = await _editPlaylist(playlist.id,
            { ...playlist, privacy: playlist.isPrivate }, "bulk");

        if (response.status != 200) {
            log.error("Failed to edit playlist", response.status);
            return false;
        }

        // Update the playlist.
        const updated = await response.json() as OwnedPlaylist;
        modifyPlaylist(updated);

        return true;
    }

    // Go through each property and edit the playlist.
    if (playlist.name) {
        const response = await _editPlaylist(playlist.id, { name: playlist.name }, "name");
        if (response.status != 200) {
            log.error("Failed to edit playlist name", response.status);
            return false;
        }
    }
    if (playlist.description) {
        const response = await _editPlaylist(playlist.id, { description: playlist.description }, "desc");
        if (response.status != 200) {
            log.error("Failed to edit playlist description", response.status);
            return false;
        }

        // Update the playlist.
        const updated = await response.json() as OwnedPlaylist;
        modifyPlaylist(updated);
    }
    if (playlist.icon) {
        const response = await _editPlaylist(playlist.id, { icon: playlist.icon }, "icon");
        if (response.status != 200) {
            log.error("Failed to edit playlist icon", response.status);
            return false;
        }

        // Update the playlist.
        const updated = await response.json() as OwnedPlaylist;
        modifyPlaylist(updated);
    }
    if (playlist.isPrivate !== undefined) {
        const response = await _editPlaylist(playlist.id, { privacy: playlist.isPrivate }, "privacy");
        if (response.status != 200) {
            log.error("Failed to edit playlist privacy", response.status);
            return false;
        }

        // Update the playlist.
        const updated = await response.json() as OwnedPlaylist;
        modifyPlaylist(updated);
    }
    if (playlist.tracks) {
        const response = await _editPlaylist(playlist.id, { tracks: playlist.tracks }, "tracks");
        if (response.status != 200) {
            log.error("Failed to edit playlist tracks", response.status);
            return false;
        }

        // Update the playlist.
        const updated = await response.json() as OwnedPlaylist;
        modifyPlaylist(updated);
    }

    return true;
}

/**
 * Adds a track to the end of a playlist.
 *
 * @param playlist The playlist to add the track to.
 * @param track The track to add to the playlist.
 */
async function addTrackToPlaylist(
    playlist: OwnedPlaylist | string, track: TrackInfo
): Promise<boolean> {
    const playlistId = typeof playlist == "string" ? playlist : playlist.id;
    const response = await _editPlaylist(playlistId, track, "add");

    if (response.status != 200) {
        log.error("Failed to add track to playlist", response.status);
        return false;
    }

    return true;
}

/**
 * Removes a track from a playlist.
 *
 * @param playlist The playlist to remove the track from.
 * @param track The track to remove from the playlist.
 */
async function removeTrackFromPlaylist(
    playlist: OwnedPlaylist | string, track: TrackInfo | number
): Promise<boolean> {
    if (typeof track != "number" && typeof playlist == "string") {
        throw new Error("Must specify the track index when removing from a playlist ID");
    }

    const playlistId = typeof playlist == "string" ? playlist : playlist.id;
    const trackIndex = typeof track == "number" ? track : (playlist as PlaylistInfo).tracks.indexOf(track);

    if (trackIndex == -1) {
        throw new Error("Track not found in playlist");
    }

    const response = await _editPlaylist(playlistId, { index: trackIndex }, "remove");

    if (response.status != 200) {
        log.error("Failed to remove track from playlist", response.status);
        return false;
    }

    return true;
}

/**
 * Deletes a playlist from the server.
 *
 * @param playlist The playlist to delete.
 */
async function deletePlaylist(playlist: OwnedPlaylist | string): Promise<boolean> {
    const playlistId = typeof playlist == "string" ? playlist : playlist.id;
    const response = await fetch(`${Backend.getBaseUrl()}/playlist/${playlistId}`, {
        method: "DELETE", headers: { authorization: await User.getToken() }
    });

    if (response.status != 200) {
        log.error("Failed to delete playlist", response.status);
        return false;
    }

    // Remove the playlist from the store.
    let playlists = Object.values(usePlaylists.getState());
    playlists = playlists.filter(p => p.id != playlistId);
    usePlaylists.setState(playlists);

    return true;
}

/**
 * Creates or imports a playlist on the server.
 *
 * @param playlist The playlist to create or import.
 */
async function createPlaylist(playlist: PlaylistInfo | string): Promise<boolean> {
    let response: Response;
    if (typeof playlist == "string") {
        response = await fetch(`${Backend.getBaseUrl()}/playlist/import`, {
            method: "PATCH", headers: {
                "Content-Type": "application/json", authorization: await User.getToken()
            },
            body: JSON.stringify({ url: playlist })
        });
    } else {
        response = await fetch(`${Backend.getBaseUrl()}/playlist/create`, {
            method: "POST", headers: {
                "Content-Type": "application/json", authorization: await User.getToken()
            },
            body: JSON.stringify(playlist)
        });
    }

    if (response.status != 201) {
        log.error("Failed to create playlist", response.status);
        return false;
    }

    // Add the playlist to the store.
    const created = await response.json() as OwnedPlaylist;
    modifyPlaylist(created);

    return true;
}

/**
 * Fetches the author of a playlist.
 *
 * @param playlist The playlist object or the ID of the owner.
 */
async function getAuthor(playlist: OwnedPlaylist | string) {
    const owner = typeof playlist == "string" ? playlist : playlist.owner;
    if (!owner) return "Unknown";

    // Check if the playlist belongs to the current user.
    let user = useUser.getState();
    if (user && user.userId == owner) {
        return user.username;
    }

    // Load the user by ID.
    user = await User.getUserById(owner);
    return user?.username ?? "Unknown";
}

export default {
    fetchPlaylist,
    findPlaylist,
    editPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist,
    createPlaylist,
    getAuthor
};
