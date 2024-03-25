import { logger } from "react-native-logs";
import * as FileSystem from "expo-file-system";

import User from "@backend/user";
import Backend from "@backend/backend";
import { randomString } from "@backend/utils";
import { usePlaylists, useUser } from "@backend/stores";
import { OwnedPlaylist, PlaylistInfo, TrackInfo } from "@backend/types";

import { alert } from "@widgets/Alert";

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
        usePlaylists.setState(playlists, true);
    } else {
        playlists.push(playlist);
        usePlaylists.setState(playlists, true);
    }

    // Save the playlists if the user isn't logged in.
    if (!User.isLoggedIn()) {
        savePlaylists()
            .catch(error => log.error("Unable to save playlists.", error));
    }
}

/**
 * Fetches a playlist using its ID.
 * Can return null if the playlist is private.
 *
 * @param id The ID of the playlist to fetch.
 */
async function fetchPlaylist(id: string): Promise<OwnedPlaylist | null> {
    // Check if the playlist exists in the store.
    const playlists = Object.values(usePlaylists.getState());
    const playlist = playlists.find(p => p.id == id);
    if (playlist) return playlist;

    // Fetch the playlist from the backend.
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
        const response = await _editPlaylist(playlist.id, { name: playlist.name }, "rename");
        if (response.status != 200) {
            log.error("Failed to edit playlist name", response.status);
            return false;
        }
    }
    if (playlist.description) {
        const response = await _editPlaylist(playlist.id, { description: playlist.description }, "describe");
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
    // Resolve local tracks.
    if (track.type == "download") {
        // Fetch the track's data.
        const response = await fetch(`${Backend.getBaseUrl()}/fetch/${track.id}`);
        if (response.status != 301) {
            alert("Unable to fetch track data");
            log.warn("Failed to fetch track data", response.status);
            return false;
        }

        // Update the track.
        track = (await response.json()) as TrackInfo;
    }

    // Check if the playlist contains the track already.
    if (typeof playlist != "string" &&
        (playlist as PlaylistInfo).tracks.includes(track)) {
        log.warn("Track already exists in playlist");
        return false;
    }

    const playlistId = typeof playlist == "string" ? playlist : playlist.id;
    const response = await _editPlaylist(playlistId, track, "add");

    if (response.status != 200) {
        log.error("Failed to add track to playlist", response.status);
        return false;
    }

    // Update the playlist.
    const updated = await response.json() as OwnedPlaylist;
    modifyPlaylist(updated);

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

    // Update the playlist.
    const updated = await response.json() as OwnedPlaylist;
    modifyPlaylist(updated);

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
    usePlaylists.setState(playlists, true);

    return true;
}

/**
 * Creates or imports a playlist on the server.
 *
 * @param playlist The playlist to create or import.
 * @return A tuple containing a boolean indicating success and the playlist ID.
 */
async function createPlaylist(playlist: PlaylistInfo | string): Promise<[boolean, string, OwnedPlaylist | undefined]> {
    // Check if the user is logged in.
    if (!User.isLoggedIn()) {
        // You cannot import playlists without signing in.
        if (typeof playlist == "string")
            return [false, "", undefined];

        // Update the playlist and save it locally.
        const created = playlist as OwnedPlaylist;
        created.id = randomString(24);
        created.owner = "local";

        // Add the playlist to the store.
        modifyPlaylist(created);

        return [true, created.id, created];
    }

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
        const reason = (await response.json()).reason;
        log.error("Failed to create playlist",
            response.status, reason);
        alert(`Unable to create playlist: ${reason}`);

        return [false, "", undefined];
    }

    // Add the playlist to the store.
    const created = await response.json() as OwnedPlaylist;
    modifyPlaylist(created);

    return [true, created.id, created];
}

/**
 * Fetches the author of a playlist.
 *
 * @param playlist The playlist object or the ID of the owner.
 */
async function getAuthor(playlist: OwnedPlaylist | string) {
    const owner = typeof playlist == "string" ? playlist : playlist.owner;
    if (!owner) return "Unknown";
    if (owner == "local") return "You";

    // Check if the playlist belongs to the current user.
    let user = useUser.getState();
    if (user && user.userId == owner) {
        return user.username;
    }

    // Load the user by ID.
    user = await User.getUserById(owner);
    return user?.username ?? "Unknown";
}

/**
 * Sets the playlist icon.
 *
 * @param playlist The playlist to set the icon for.
 * @param icon The icon to set, encoded in Base64.
 */
async function setPlaylistIcon(playlist: OwnedPlaylist, icon: [string, string]): Promise<boolean> {
    if (icon == null || icon[0].length == 0) return false;

    // Check if the playlist is local.
    if (playlist.owner == "local") {
        // Save the playlist icon locally.
        const iconPath = `${FileSystem.documentDirectory}playlists/${playlist.id}.jpg`;
        try {
            // If the playlist already had a file-based icon, delete it.
            if (playlist.icon.startsWith("file://")) {
                await FileSystem.deleteAsync(playlist.icon);
            }

            await FileSystem.copyAsync({
                from: icon[1], to: iconPath
            });
        } catch (error) {
            log.error("Failed to save playlist icon", error);
            return false;
        }

        // Update the playlist icon.
        playlist.icon = iconPath;
        modifyPlaylist(playlist);

        return true;
    }

    const response = await fetch(`${Backend.getBaseUrl()}/playlist/${playlist.id}/icon`, {
        method: "POST", headers: {
            "Content-Type": "text/plain", authorization: await User.getToken()
        },
        body: icon[0]
    });

    if (response.status != 200) {
        log.error("Failed to set playlist icon",
            response.status,
            await response.text());
        return false;
    }

    // Edit the playlist icon URL.
    const { url } = await response.json();
    playlist.icon = url;

    modifyPlaylist(playlist);

    return true;
}

/**
 * Saves all existing playlists in the store to the file system.
 */
async function savePlaylists(): Promise<void> {
    const playlists = Object.values(usePlaylists.getState());
    for (const playlist of playlists) {
        const path = `${FileSystem.documentDirectory}playlists/${playlist.id}.json`;
        try {
            await FileSystem.writeAsStringAsync(path, JSON.stringify(playlist));
        } catch (error) {
            log.error(`Failed to save playlist: ${playlist.id}`, error);
        }
    }
}

export default {
    fetchPlaylist,
    editPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist,
    createPlaylist,
    getAuthor,
    setPlaylistIcon,
    modifyPlaylist
};
