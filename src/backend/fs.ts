import type { TrackData } from "@backend/types";
import type { Track } from "react-native-track-player";
import type { DownloadResult } from "react-native-fs";

import { asTrack } from "@backend/audio";

import { DocumentDirectoryPath } from "react-native-fs";
import { downloadFile, writeFile, readFile, mkdir, unlink, readDir, exists } from "react-native-fs";

/**
 * Creates the folders needed for Laudiolin.
 */
export async function createFolders(): Promise<void> {
    await mkdir(`${DocumentDirectoryPath}/tracks`);
}

/**
 * Creates the folder for a track.
 * @param track A track data object.
 */
export async function createTrackFolder(track: TrackData): Promise<void> {
    await mkdir(`${DocumentDirectoryPath}/tracks/${track.id}`);
}

/**
 * Deletes the folder for a track.
 * @param track A track data object.
 */
export async function deleteTrackFolder(track: TrackData): Promise<void> {
    await unlink(`${DocumentDirectoryPath}/tracks/${track.id}`);
}

/**
 * Standardized way to get the file path for a track.
 * @param track A track data object.
 */
export function getTrackPath(track: TrackData): string {
    return `${DocumentDirectoryPath}/tracks/${track.id}/audio.mp3`;
}

/**
 * Standardized way to get the file path for a track's icon.
 * @param track A track data object.
 */
export function getIconPath(track: TrackData): string {
    return `${DocumentDirectoryPath}/tracks/${track.id}/icon.png`;
}

/**
 * Standardized way to get the file path for a track's data.
 * @param track A track data object.
 */
export function getDataPath(track: TrackData): string {
    return `${DocumentDirectoryPath}/tracks/${track.id}/data.json`;
}

/**
 * Gets the IDs of all downloaded tracks.
 */
export async function getDownloadedTracks(): Promise<string[]> {
    const files = await readDir(`${DocumentDirectoryPath}/tracks`);
    return files.map(file => file.name);
}

/**
 * Loads a track's data from the file system.
 * @param trackId The ID of the track to load.
 */
export async function loadLocalTrackData(trackId: string): Promise<TrackData> {
    return JSON.parse(
        await readFile(`${DocumentDirectoryPath}/tracks/${trackId}/data.json`)
    );
}

/**
 * Loads a track from the file system.
 * @param trackId The ID of the track to load.
 */
export async function loadLocalTrack(trackId: string): Promise<Track> {
    const trackData = await loadLocalTrackData(trackId);
    return asTrack(trackData, true);
}

/**
 * Checks if the files needed for a track to load exist.
 * @param track A track data object.
 */
export async function trackExists(track: TrackData): Promise<boolean> {
    return (await exists(getTrackPath(track))) &&
        (await exists(getIconPath(track))) &&
        (await exists(getDataPath(track)))
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

/**
 * Writes the data to the file system.
 * @param data The data to write.
 * @param path The path to save the file to.
 */
export async function saveData(data: any, path: string): Promise<void> {
    return writeFile(path, JSON.stringify(data));
}
