/**
 * @format
 */

import { AppRegistry } from "react-native";
import TrackPlayer from "react-native-track-player";

import App from "@app/App";
import { setAppData } from "@app/constants";
import { playbackService } from "@backend/audio";

// Setup event listeners.
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

    // Initialize the track player.
    await TrackPlayer.setupPlayer();
}
