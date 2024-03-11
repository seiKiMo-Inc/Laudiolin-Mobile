import { logger } from "react-native-logs";

import User from "@backend/user";
import Backend from "@backend/backend";
import { useUser } from "@backend/stores";
import { PlaylistInfo } from "@backend/types";

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
    getAuthor
};
