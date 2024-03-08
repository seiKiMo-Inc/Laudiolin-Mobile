import TrackPlayer, { Event } from "react-native-track-player";
import { TrackInfo } from "@backend/types";

const requestData = {
    userAgent: "seiKiMo/Laudiolin-Mobile",
    contentType: "audio/mpeg"
};

/**
 * Adds event listeners to the track player.
 */
export const PlaybackService = async () => {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => TrackPlayer.seekTo(position));
};

/**
 * Plays a track from the given info.
 *
 * @param track The track to play.
 */
async function play(track: TrackInfo): Promise<void> {
    await TrackPlayer.reset();
    await TrackPlayer.add({
        ...requestData,
        id: track.id,
        url: `https://app.seikimo.moe/download?id=${track.id}`,
        title: track.title,
        artist: track.artist,
        artwork: track.icon,
    });
    await TrackPlayer.play();
}

export default {
    play
};
