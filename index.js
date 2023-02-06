/**
 * @format
 */

import { AppRegistry } from "react-native";
import TrackPlayer from "react-native-track-player";

import App from "@app/App";
import { setAppData } from "@app/constants";
import { playbackService } from "@backend/audio";

import { console } from "@app/utils";

// Setup event listeners.
import * as fs from "@backend/fs";
import * as gateway from "@backend/gateway";
import * as settings from "@backend/settings";

import * as app from "./app.json";

// Register the application.
AppRegistry.registerComponent(app.name, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);

// Run the initialization.
(async() => initialize())();
async function initialize() {
    setAppData(app); // Set the app data.

    // Fetch the application settings.
    settings.reloadSettings()
        .catch(err => console.error("Failed to load settings.", err));
    // Create folders if needed.
    fs.createFolders()
        .catch(err => console.error("Failed to create folders.", err));

    // Initialize the gateway.
    gateway.setupListeners();
    gateway.connect();

    try {
        // Initialize the track player.
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            progressUpdateEventInterval: 1
        });
    } catch (err) {
        console.error("Failed to initialize the track player.", err);
    }
}
