import * as FileSystem from "expo-file-system";
import { logger } from "react-native-logs";
import { EventRegister } from "react-native-event-listeners";
import TrackPlayer, { Event, PlaybackActiveTrackChangedEvent } from "react-native-track-player";

import User from "@backend/user";
import Playlist from "@backend/playlist";
import { usePlaylists, useRecents } from "@backend/stores";
import { OwnedPlaylist, RemoteInfo, TrackInfo, User as UserType } from "@backend/types";

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
    // Listen for track player events.
    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, addToRecents);

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
async function _setup(_: false | UserType): Promise<void> {
    // Resolve local playlists.
    const playlistsDir = `${FileSystem.documentDirectory}playlists`;
    const playlists = await FileSystem.readDirectoryAsync(playlistsDir);
    await loadPlaylists(playlists);
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
 * Adds the new track to the recents.
 */
function addToRecents({ track }: PlaybackActiveTrackChangedEvent): void {
    if (!track || User.isLoggedIn()) return;

    // Get the track info.
    const info = track.source as TrackInfo;
    if (!info) return;

    // Add the track to the recents.
    const recents = Object.values(useRecents.getState());

    const mostRecent = recents[0];
    if (mostRecent?.id != info?.id) {
        if (info.type != "remote") return;

        // Add the track to the user's recently played.
        if (recents.length >= 10) {
            // Remove the oldest track.
            recents.pop();
        }
        recents.unshift(info);

        // Remove any duplicates.
        const newList: RemoteInfo[] = [];
        recents.forEach(track => {
            if (!newList.find(t => t.id === track.id)) {
                newList.push(track);
            }
        });

        useRecents.setState(newList, true);
    }
}

export default {
    setup
};
