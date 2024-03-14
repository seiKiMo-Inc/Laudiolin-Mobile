import { logger } from "react-native-logs";

import User from "@backend/user";
import Backend from "@backend/backend";
import { usePlaylists, useUser } from "@backend/stores";
import { PlaylistInfo } from "@backend/types";
import { copy } from "@backend/utils";

const log = logger.createLogger();

/**
 * Fetches a playlist using its ID.
 * Can return null if the playlist is private.
 *
 * @param id The ID of the playlist to fetch.
 */
async function fetchPlaylist(id: string): Promise<PlaylistInfo | null> {
    const response = await fetch(`${Backend.getBaseUrl()}/playlist/${id}`, {
        cache: "no-cache", headers: { authorization: await User.getToken() }
    });

    if (response.status != 301) {
        log.error("Failed to fetch playlist", response.status);
        return null;
    }

    try {
        return (await response.json()) as PlaylistInfo;
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
async function findPlaylist(id: string): Promise<PlaylistInfo | null> {
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

        // Set the playlist internally.
        let playlists = usePlaylists.getState();
        playlists = playlists.map(p => {
            if (p.id != playlist.id) return p;

            // Internal rename/update.
            p = copy(playlist, p);
            p.isPrivate = playlist.isPrivate ?? true;

            return p;
        });
        usePlaylists.setState(playlists);

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
    }
    if (playlist.icon) {
        const response = await _editPlaylist(playlist.id, { icon: playlist.icon }, "icon");
        if (response.status != 200) {
            log.error("Failed to edit playlist icon", response.status);
            return false;
        }
    }
    if (playlist.isPrivate !== undefined) {
        const response = await _editPlaylist(playlist.id, { privacy: playlist.isPrivate }, "privacy");
        if (response.status != 200) {
            log.error("Failed to edit playlist privacy", response.status);
            return false;
        }
    }
    if (playlist.tracks) {
        const response = await _editPlaylist(playlist.id, { tracks: playlist.tracks }, "tracks");
        if (response.status != 200) {
            log.error("Failed to edit playlist tracks", response.status);
            return false;
        }
    }

    return true;
}

/**
 * Fetches the author of a playlist.
 *
 * @param playlist The playlist object or the ID of the owner.
 */
async function getAuthor(playlist: PlaylistInfo | string) {
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
    getAuthor
};
