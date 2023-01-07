import type { TrackData } from "@backend/types";
import type { DownloadResult } from "react-native-fs";

import { DocumentDirectoryPath } from "react-native-fs";
import { downloadFile, exists } from "react-native-fs";

/**
 * Standardized way to get the file path for a track.
 * @param track A track data object.
 */
export function getTrackPath(track: TrackData): string {
    return `${DocumentDirectoryPath}/${track.id}.mp3`;
}

/**
 * Standardized way to get the file path for a track's icon.
 * @param track A track data object.
 */
export function getIconPath(track: TrackData): string {
    return `${DocumentDirectoryPath}/${track.id}.png`;
}

/**
 * Checks if the files needed for a track to load exist.
 * @param track A track data object.
 */
export async function trackExists(track: TrackData): Promise<boolean> {
    return (await exists(getTrackPath(track))) && (await exists(getIconPath(track)));
}

/**
 * Downloads the content from the URL and saves it to the file system.
 * @param url The URL to download from.
 * @param path The path to save the file to.
 * @return The download result.
 */
export async function downloadUrl(url: string, path: string): Promise<DownloadResult> {
    return downloadFile({ fromUrl: url, toFile: path }).promise;
}
