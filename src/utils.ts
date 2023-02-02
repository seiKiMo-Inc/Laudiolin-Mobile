import { TrackData } from "@backend/types";
import { Gateway } from "@app/constants";

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

    return url;
}
