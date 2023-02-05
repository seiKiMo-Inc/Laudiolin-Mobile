import { Linking } from "react-native";

import { TrackData } from "@backend/types";
import { Gateway } from "@app/constants";
import { Track } from "react-native-track-player";

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
 * Attempts to open the track in the web browser.
 * @param track The track to open.
 */
export function openTrack(track: Track|TrackData): void {
    openUrl(track.url as string);
}

/**
 * Attempts to open the URL in the web browser.
 * @param url The URL to open.
 */
export function openUrl(url: string): void {
    Linking.canOpenURL(url).then(supported => {
        supported && Linking.openURL(url);
    });
}
