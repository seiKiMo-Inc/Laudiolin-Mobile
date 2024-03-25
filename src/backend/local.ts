import * as FileSystem from "expo-file-system";
import { logger } from "react-native-logs";
import { EventRegister } from "react-native-event-listeners";

import Playlist from "@backend/playlist";
import { OwnedPlaylist, User } from "@backend/types";
import { usePlaylists } from "@backend/stores";

const log = logger.createLogger();

/**
 * Makes a directory in the user's documents folder.
 *
 * @param name The name of the directory to create.
 */
async function mkdir(name: string): Promise<boolean> {
    const path = `${FileSystem.documentDirectory}${name}`;
    try {
        const data = await FileSystem.getInfoAsync(path);
        if (data.exists && data.isDirectory) {
            return true;
        }

        await FileSystem.makeDirectoryAsync(path, { intermediates: true });
        return true;
    } catch (error) {
        log.error("Unable to create directory.", error);
        return false;
    }
}

/**
 * Loads on-device data into the local stores.
 * Should be called after the user is authenticated.
 */
async function setup(): Promise<void> {
    // Wait for the user data to finish loading.
    EventRegister.addEventListener("user:login", _setup);

    // Create storage folders.
    if (!await mkdir("playlists")) {
        throw new Error("Unable to create playlists directory.");
    }
    if (!await mkdir("localData")) {
        throw new Error("Unable to create local data directory.");
    }
}

/**
 * Internal setup function.
 */
async function _setup(_: false | User): Promise<void> {
    // Resolve local playlists.
    const playlistsDir = `${FileSystem.documentDirectory}playlists`;
    const playlists = await FileSystem.readDirectoryAsync(playlistsDir);
    await loadPlaylists(playlists);

    // Resolve local data.
    const localDataDir = `${FileSystem.documentDirectory}localData`;
    const localData = await FileSystem.readDirectoryAsync(localDataDir);
    await loadLocalData(localData);
}

/**
 * Loads playlist data from the given files.
 *
 * @param files The path to the playlist files.
 */
async function loadPlaylists(files: string[]) {
    for (const file of files) {
        if (!file.endsWith(".json")) continue;
        const path = `${FileSystem.documentDirectory}playlists/${file}`;

        // Validate the playlist file.
        const info = await FileSystem.getInfoAsync(path);
        if (!info.exists || info.isDirectory) {
            log.warn(`Invalid playlist file: ${file}`);
            continue;
        }

        // Load the playlist data.
        try {
            const fileData = await FileSystem.readAsStringAsync(path);
            const playlist = JSON.parse(fileData) as OwnedPlaylist;

            // Check if the playlist exists in the store.
            const playlists = Object.values(usePlaylists.getState());
            if (!playlists.find(p => p.id === playlist.id)) {
                Playlist.modifyPlaylist(playlist);
            }
        } catch (error) {
            log.error(`Failed to load playlist: ${file}`, error);
        }
    }
}

/**
 * Loads local user data from the given files.
 *
 * @param files The path to the local data files.
 */
async function loadLocalData(files: string[]) {

}

export default {
    setup
};
