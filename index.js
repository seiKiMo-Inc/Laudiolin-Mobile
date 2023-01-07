/**
 * @format
 */

import { AppRegistry } from "react-native";
import TrackPlayer from "react-native-track-player";

import App from "@app/App";
import { setAppData } from "@app/constants";
import { playbackService } from "@backend/audio";

import * as app from "./app.json";

// Register the application.
AppRegistry.registerComponent(app.name, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);

// Run the initialization.
(async() => initialize())();
async function initialize() {
    // Initialize the track player.
    await TrackPlayer.setupPlayer();

    // Set the app data.
    setAppData(app);

    console.log("Finished initialization!");
}
