import { logger } from "react-native-logs";

import Backend from "@backend/backend";
import { SearchResult, SearchEngine, TrackInfo, blank_SearchResult } from "@backend/types";

const log = logger.createLogger();

/**
 * Performs a track search on the backend.
 *
 * @param query The song to search for.
 * @param engine The engine to use for the search.
 */
export async function search(
    query: string, engine: SearchEngine = "YouTube"
): Promise<SearchResult> {
    const response = await fetch(
        `${Backend.getBaseUrl()}/search/${query}?engine=${engine}`,
        { cache: "default" }
    );

    if (response.status == 404)
        return blank_SearchResult;

    try {
        return (await response.json()) as SearchResult;
    } catch (error) {
        log.error("Failed to parse search result.", error);
        return {
            top: null,
            results: []
        };
    }
}

/**
 * Parses the tracks from a search result.
 *
 * @param result The search result to parse.
 */
export function tracks({ results, top }: SearchResult): TrackInfo[] {
    if (!top || results.length == 0) return [];

    const tracks: { [key: string]: TrackInfo } = {};
    tracks[top.id] = top;

    for (const track of results) {
        if (!tracks[track.id]) {
            tracks[track.id] = track;
        }
    }

    return Object.values(tracks);
}

/**
 * Parses the author of a track.
 *
 * @param track The track to parse.
 */
export function artist(track: TrackInfo | string | undefined): string {
    if (!track) return "Unknown";

    let artist = typeof track == "string" ? track : track.artist;
    return artist.length == 0 ? "Unknown" : artist;
}
