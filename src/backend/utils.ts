import { logger } from "react-native-logs";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";
import { ImagePickerResult, launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";

import Backend from "@backend/backend";

const log = logger.createLogger();

const base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

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
    if (icon == undefined || icon == "") return ""; // No icon or ID, so no icon.
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
    return toIconUrl(icon) ?? icon; // Fallback to whatever is provided if all else fails.
}

/**
 * Base64 encode function using the URL-safe alphabet.
 * Sourced from https://github.com/eranbo/react-native-base64.
 *
 * @param input The input string to encode.
 */
export function base64Encode(input: string): string {
    const output = [];
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output.push(
            base64Alphabet.charAt(enc1) +
            base64Alphabet.charAt(enc2) +
            base64Alphabet.charAt(enc3) +
            base64Alphabet.charAt(enc4))
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output.join("");
}

/**
 * Converts the direct URL to an icon into a proxy URL.
 *
 * @param icon The direct URL to the icon.
 */
export function toIconUrl(icon: string | undefined): string | undefined {
    if (icon == undefined || icon == "") return undefined;
    return `${Backend.getBaseUrl()}/proxy/icon?url=${base64Encode(icon)}`;
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

/**
 * Default settings for picking an icon.
 */
export async function pickIcon(): Promise<ImagePickerResult> {
    return await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        base64: true,
        aspect: [4, 3],
        quality: 1,
    });
}

/**
 * Runs SHA-256 on the provided string.
 *
 * @param data The string to hash.
 * @param length The length of the hash to return. -1 returns the full hash.
 */
export async function sha256(
    data: string, length: number = -1
): Promise<string> {
    const digest = await digestStringAsync(
        CryptoDigestAlgorithm.SHA256, data
    );
    return length == -1 ? digest : digest.substring(0, length);
}
