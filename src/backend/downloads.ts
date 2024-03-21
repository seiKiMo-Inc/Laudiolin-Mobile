import { Base64 } from "js-base64";
import { logger } from "react-native-logs";
import * as FileSystem from "expo-file-system";
import { DocumentPickerAsset } from "expo-document-picker";

import Backend from "@backend/backend";
import { resolveIcon } from "@backend/utils";
import { useDownloads } from "@backend/stores";
import { DownloadInfo, RemoteInfo } from "@backend/types";

import { alert } from "@widgets/Alert";

const log = logger.createLogger();

/**
 * Called when the app initializes to set up the file system.
 */
async function setup(): Promise<void> {
    const downloadDir = `${FileSystem.documentDirectory}downloads`;
    const info = await FileSystem.getInfoAsync(downloadDir);
    if (!info.exists) {
        await FileSystem.makeDirectoryAsync(downloadDir);
    } else {
        // Synchronize the downloads with the file system.
        const allFiles = await FileSystem.readDirectoryAsync(downloadDir);
        const downloads = useDownloads.getState().downloaded;

        // Add/remove any downloads in the state which are not in the file system.
        for (const download of downloads) {
            if (!allFiles.includes(download.id)) {
                useDownloads.getState().remove(download.id);
            }
        }
    }
}

/**
 * Attempts to download a remote track to the local file system.
 *
 * @param info The remote track to download.
 */
async function download(info: RemoteInfo): Promise<boolean> {
    const baseDir = `${FileSystem.documentDirectory}downloads`;
    const path = `${baseDir}/${info.id}`; // This is where the track data will be saved.

    // Check if the track is saved.
    let fsInfo = await FileSystem.getInfoAsync(path);
    if (fsInfo.exists) {
        // Ensure the rest of the data is correct.
        const dataFile = await FileSystem.getInfoAsync(`${path}/track.json`);
        const trackFile = await FileSystem.getInfoAsync(`${path}/track.mp3`);
        const coverFile = await FileSystem.getInfoAsync(`${path}/cover.jpg`);
        if (dataFile.exists && trackFile.exists && coverFile.exists) {
            return true;
        }

        // Delete the directory.
        await FileSystem.deleteAsync(path, { idempotent: true });
    }

    // Create the directory.
    await FileSystem.makeDirectoryAsync(path);

    // Convert the remote info to a download info.
    const local = Object.assign({}, info as unknown) as DownloadInfo;
    local.type = "download";

    try {
        // Encode the title. (this ensures Unicode characters are preserved)
        local.encoded = true;
        local.title = Base64.encode(info.title);
    } catch (error) {
        alert(`Failed to download a track: ${error}`);
        log.error("Unable to encode title.", info, error);
        return false;
    }

    try {
        // Write the track data to the file system.
        await FileSystem.writeAsStringAsync(`${path}/track.json`, JSON.stringify(local));
        await FileSystem.downloadAsync(resolveIcon(info.icon), `${path}/cover.jpg`);
        await FileSystem.downloadAsync(`${Backend.getBaseUrl()}/download?id=${info.id}`, `${path}/track.mp3`);
    } catch (error) {
        alert(`Failed to download a track: ${error}`);
        log.error("Unable to download track.", info, error);
        return false;
    }

    // Change references to the local file system.
    local.icon = `${path}/cover.jpg`;
    local.filePath = `${path}/track.mp3`;
    local.title = info.title;
    // Add the track to the downloaded list.
    useDownloads.getState().add(local);

    return true;
}

/**
 * Imports a track from the file system.
 *
 * @param file The file to import.
 * @param metadata The user provided metadata about the track.
 */
async function $import(
    file: DocumentPickerAsset, metadata: DownloadInfo
): Promise<boolean> {
    // Create the track directory.
    const baseDir = `${FileSystem.documentDirectory}downloads`;
    const path = `${baseDir}/${metadata.id}`;

    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) {
        if (__DEV__) {
            await FileSystem.deleteAsync(path, { idempotent: true });
        }

        return false;
    }

    await FileSystem.makeDirectoryAsync(path);

    metadata.type = "download";
    metadata.filePath = `${path}/track.mp3`;

    try {
        // Encode the title. (this ensures Unicode characters are preserved)
        metadata.encoded = true;
        metadata.title = Base64.encode(metadata.title);
    } catch (error) {
        log.error("Unable to import track.", error);
        return false;
    }

    // Copy the track to the track directory.
    await FileSystem.copyAsync({ from: file.uri, to: `${path}/track.mp3` });
    // Copy the icon to the track directory.
    await FileSystem.downloadAsync(metadata.icon, `${path}/cover.jpg`);
    // Write the metadata to the track directory.
    await FileSystem.writeAsStringAsync(`${path}/track.json`, JSON.stringify(metadata));

    // Change references to the local file system.
    metadata.icon = `${path}/cover.jpg`;
    metadata.filePath = `${path}/track.mp3`;
    metadata.title = Base64.decode(metadata.title);
    // Add the track to the downloaded list.
    useDownloads.getState().add(metadata);

    return true;
}

/**
 * Removes a download from the file system.
 *
 * @param info The download to remove.
 */
async function remove(info: DownloadInfo): Promise<void> {
    const path = `${FileSystem.documentDirectory}downloads/${info.id}`;
    await FileSystem.deleteAsync(path, { idempotent: true });
    useDownloads.getState().remove(info.id);
}

/** [songs downloaded, storage taken] */
type DownloadStats = [number, number];

/**
 * Fetches information about the user's downloads.
 */
async function downloadInfo(): Promise<DownloadStats> {
    const baseDir = `${FileSystem.documentDirectory}downloads`;
    const info = await FileSystem.getInfoAsync(baseDir);
    if (!info.exists) {
        return [0, 0];
    }

    const allFiles = await FileSystem.readDirectoryAsync(baseDir);
    const downloads = useDownloads.getState().downloaded;

    let size = 0;
    for (const download of downloads) {
        if (allFiles.includes(download.id)) {
            const path = `${baseDir}/${download.id}`;
            const trackFile = await FileSystem.getInfoAsync(`${path}/track.mp3`);
            if (trackFile.exists) {
                size += trackFile.size;
            }
        }
    }

    return [downloads.length, size];
}

export default {
    setup,
    download,
    remove,
    downloadInfo,
    import: $import
};
