import "react-native-gesture-handler";

import { registerRootComponent } from "expo";
import { logger } from "react-native-logs";
import TrackPlayer, { Capability, IOSCategory, IOSCategoryOptions } from "react-native-track-player";

import App from "./App";

import User from "@backend/user";
import Downloads from "@backend/downloads";
import { PlaybackService } from "@backend/player";

const log = logger.createLogger();

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => PlaybackService);

(async() => {
    User.setup();
    Downloads.setup()
        .catch(error => log.error("Encountered error while setting up downloads", error));

    await TrackPlayer.setupPlayer({
        iosCategory: IOSCategory.Playback,
        iosCategoryOptions: [
            IOSCategoryOptions.MixWithOthers, IOSCategoryOptions.MixWithOthers,
            IOSCategoryOptions.AllowAirPlay, IOSCategoryOptions.AllowBluetooth
        ]
    });
    await TrackPlayer.updateOptions({
        capabilities: [
            Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious,
            Capability.SeekTo, Capability.Stop
        ],
        compactCapabilities: [Capability.Play, Capability.Pause]
    });
})();
