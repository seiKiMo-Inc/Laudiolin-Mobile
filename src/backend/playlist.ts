import { logger } from "react-native-logs";

import Backend from "@backend/backend";
import { PlaylistInfo } from "@backend/types";

const log = logger.createLogger();

/**
 * Fetches a playlist using its ID.
 * Can return null if the playlist is private.
 *
 * @param id The ID of the playlist to fetch.
 */
async function fetchPlaylist(id: string): Promise<PlaylistInfo | null> {
    const response = await fetch(`${Backend.getBaseUrl()}/playlist/${id}`);

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

export default {
    fetchPlaylist
};
