import "react-native-gesture-handler";

import { registerRootComponent } from "expo";
import TrackPlayer, { Capability, IOSCategory, IOSCategoryOptions } from "react-native-track-player";

import App from "./App";

import { PlaybackService } from "@backend/Player";

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => PlaybackService);

(async() => {
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
            Capability.Like, Capability.SeekTo, Capability.Stop
        ],
        compactCapabilities: [Capability.Play, Capability.Pause]
    });
})();
