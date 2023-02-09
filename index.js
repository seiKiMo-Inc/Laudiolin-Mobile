/**
 * @format
 */

import { AppRegistry } from "react-native";
import TrackPlayer, { Capability } from "react-native-track-player";

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

// Set the app data.
setAppData(app);

// Fetch the application settings.
settings.reloadSettings()
    .catch(err => console.error("Failed to load settings.", err));
// Create folders if needed.
fs.createFolders()
    .catch(err => console.error("Failed to create folders.", err));

// Initialize the gateway.
gateway.setupListeners();
gateway.connect();

// Initialize the track player.
TrackPlayer.setupPlayer()
    .then(async () => {
        await TrackPlayer.updateOptions({
            progressUpdateEventInterval: 1,
            stoppingAppPausesPlayback: true,
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.Stop,
                Capability.SeekTo,
            ],
            compactCapabilities: [
                Capability.Play,
                Capability.Pause,
            ],
        });
    })
    .catch(err => console.error(err));
