import type { TrackData } from "@backend/types";

import { Gateway } from "@app/constants";

/**
 * Returns the URL for audio playback.
 * @param track The track to get the URL for.
 */
export function getStreamingUrl(track: TrackData): string {
    return `${Gateway.url}/download?id=${track.id}`;
}
