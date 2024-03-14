import { logger } from "react-native-logs";

import Backend from "@backend/backend";

const log = logger.createLogger();

/**
 * Determines which welcoming text to show the user.
 */
export function welcomeText(): string {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning!";
    if (hours < 18) return "Good afternoon!";
    return "Good evening!";
}

/**
 * Validates a server address.
 *
 * @param address The address to validate.
 */
export function validateAddress(address: string): string | null {
    if (!__DEV__ && !address.startsWith("https"))
        return "Address must be secure.";
    else if (!address.startsWith("http"))
        return "Invalid address.";

    if (!address.includes("://")) return "Invalid address.";
    if (!address.includes(".")) return "Invalid address.";

    return null; // All checks passed!
}

/**
 * Validates a socket server address.
 *
 * @param address The address to validate.
 */
export function validateSocket(address: string): string | null {
    if (!__DEV__ && !address.startsWith("wss"))
        return "Address must be secure.";
    else if (!address.startsWith("ws"))
        return "Invalid address.";

    if (!address.includes("://")) return "Invalid address.";
    if (!address.includes(".")) return "Invalid address.";

    return null; // All checks passed!
}

/**
 * Finds the first `many` elements in an array.
 *
 * @param array The array to search.
 * @param many The number of elements to find.
 */
export function first<T>(array: T[], many: number): T[] {
    if (!array) return [];
    if (array.length <= many) return array;
    return array.slice(0, many);
}

/**
 * Determines which icon URL to use for a track.
 *
 * @param icon The provided track icon URL.
 */
export function resolveIcon(icon: string): string {
    if (icon == "") return ""; // No icon or ID, so no icon.
    if (icon.includes("file://")) return icon; // Skip local files.
    if (icon.includes(Backend.getBaseUrl())) return icon; // The icon is already proxied.
    if (icon.includes("app.magix.lol")) {
        // The icon is a legacy URL, so we need to change its base.
        return icon.replace("https://app.magix.lol", Backend.getBaseUrl());
    }

    let url = `${Backend.getBaseUrl()}/proxy/{ico}?from={src}`;
    let split = icon.split("/");

    if (icon.includes("i.ytimg.com")) {
        return url.replace("{ico}", split[4]).replace("{src}", "yt");
    }
    if (icon.includes("i.scdn.co")) {
        return url.replace("{ico}", split[4]).replace("{src}", "spot");
    }
    if (icon.includes("lh3.googleusercontent.com")) {
        return url.replace("{ico}", split[3]).replace("{src}", "cart");
    }

    log.warn("Unknown icon URL:", icon);
    return icon; // Fallback to whatever is provided if all else fails.
}

/**
 * Copies any non-undefined properties from the source to the destination.
 *
 * @param source The source object to copy from.
 * @param dest The destination object to copy to.
 */
export function copy(source: any, dest: any): any {
    for (let key in source) {
        if (source[key] !== undefined)
            dest[key] = source[key];
    }
    return dest;
}
