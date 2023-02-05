import { Linking } from "react-native";

import { TrackData } from "@backend/types";
import { Gateway } from "@app/constants";
import { Track } from "react-native-track-player";

import { logger } from "react-native-logs";
export const console = logger.createLogger();

/**
 * Matches the icon URL to the correct proxy URL.
 * @param track The track to get the icon URL for.
 */
export function getIconUrl(track: TrackData): string {
    // Check if the icon is already a proxy.
    if (track.icon.includes("/proxy/")) return track.icon;

    let url = `${Gateway.url}/proxy/{ico}?from={src}`;

    // Match the icon URL to the correct proxy URL.
    const iconUrl = track.icon;
    let split = iconUrl.split("/");

    if (iconUrl.includes("i.ytimg.com")) {
        return url
            .replace("{ico}", split[4])
            .replace("{src}", "yt");
    }
    if (iconUrl.includes("i.scdn.co")) {
        return url
            .replace("{ico}", split[4])
            .replace("{src}", "spot");
    }
    if (iconUrl.includes("lh3.googleusercontent.com")) {
        return url
            .replace("{ico}", split[3])
            .replace("{src}", "cart");
    }

    return url;
}

/**
 * Gets the original URL of the track.
 * @param id The ID of the track to get the URL for.
 */
export function getOriginalUrl(id: string): string {
    switch (id.length) {
        case 11: return `https://www.youtube.com/watch?v=${id}`;
        case 12: return `https://open.spotify.com/track/${id}`;
        default: return `https://laudiolin.seikimo.moe/track/${id}`;
    }
}

/**
 * Attempts to open the track in the web browser.
 * @param track The track to open.
 */
export function openTrack(track: Track|TrackData): void {
    openUrl(getOriginalUrl(track.id as string));
}

/**
 * Attempts to open the URL in the web browser.
 * @param url The URL to open.
 */
export function openUrl(url: string): void {
    Linking.openURL(url)
        .catch(error => console.error(`Failed to open URL: ${error}`));
}
