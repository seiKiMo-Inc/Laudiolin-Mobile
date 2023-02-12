import { readDir, unlink } from "react-native-fs";
import { DocumentDirectoryPath } from "react-native-fs";

import * as fs from "@backend/fs";
import * as audio from "@backend/audio";
import { system } from "@backend/settings";

import { userData, playlists, favorites } from "@backend/user";
import type { OfflineUserData, Playlist, TrackData, User } from "@backend/types";

import { console } from "@app/utils";

const userDataPath = `${DocumentDirectoryPath}/userData.json`;
const playlistsPath = `${DocumentDirectoryPath}/playlists`;

export let isOffline = false; // Whether the app is in offline mode.

/**
 * Loads the user data from the file system.
 */
export async function loadState(
    userData: (data: User) => void,
    playlists: (data: Playlist[]) => void,
    favorites: (data: TrackData[]) => void
): Promise<void> {
    isOffline = system().offline; // Update the offline status.
    if (!isOffline) return; // Return if offline support is disabled.

    // Load the offline data from the filesystem.
    const data = await fs.readData(userDataPath);
    if (!data) {
        console.error("Unable to load offline user data."); return;
    }

    // Read the user data.
    const offlineData = data as OfflineUserData;
    console.info("Loaded offline user data.");
    // Read the playlists from the file system.
    const playlistFiles = (await readDir(playlistsPath))
        .map(file => file.name);
    console.info("Loaded offline playlists.");
    const playlistData = await Promise.all(playlistFiles.map(async file =>
        await fs.readData(`${playlistsPath}/${file}`)
    ));
    console.info("Loaded offline playlist data.");
    // Read the favorites from the file system.
    const favoriteData = await Promise.all(offlineData.favorites.map(async id =>
        await fs.readData(fs.getDataPath({ id }))
    ));
    console.info("Loaded offline favorites.");

    // Invoke the callbacks.
    userData(offlineData.user);
    playlists(playlistData as Playlist[]);
    favorites(favoriteData as TrackData[]);
}

/**
 * Saves all tracks to the file system.
 * @param tracks An array of track data objects.
 */
function saveTracks(tracks: TrackData[]): void {
    tracks.forEach(track => {
        audio.downloadTrack(track, false)
            .catch(err => console.error(err));
    });
}

/**
 * Toggles the offline support for the app.
 * Performs actions to clean up or save data.
 * @param enabled Whether to enable or disable offline support.
 */
export async function offlineSupport(enabled: boolean): Promise<void> {
    if (enabled) {
        // Save user data to the file system.
        const data: OfflineUserData = {
            user: userData!,
            playlists: [],
            favorites: favorites.map(track => track.id),
        };

        // Save the playlists to the file system.
        playlists.forEach(playlist => {
            // Save the playlist ID to the user data.
            playlist.id && data.playlists.push(playlist.id);
            // Save the playlist to the file system.
            fs.saveData(playlist, `${playlistsPath}/${playlist.id}.json`);
            // Download the tracks in the playlist.
            saveTracks(playlist.tracks);
        });

        saveTracks(favorites); // Download every favorite track.
        await fs.saveData(data, userDataPath); // Save the user data.
    } else {
        await unlink(userDataPath); // Delete the saved user data.
        await unlink(playlistsPath); // Delete the saved playlists.
    }
}
