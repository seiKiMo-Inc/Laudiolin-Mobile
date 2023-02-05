/**
 * @format
 */

import { AppRegistry } from "react-native";
import TrackPlayer from "react-native-track-player";

import App from "@app/App";
import { setAppData } from "@app/constants";
import { playbackService } from "@backend/audio";

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
    await settings.reloadSettings();
    // Create folders if needed.
    await fs.createFolders();

    // Initialize the gateway.
    await gateway.setupListeners();
    await gateway.connect()

    // Initialize the track player.
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 1
    });
}
