import TrackPlayer, { Event } from "react-native-track-player";

import Backend from "@backend/backend";
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
        url: `${Backend.getBaseUrl()}/download?id=${track.id}`,
        title: track.title,
        artist: track.artist,
        artwork: track.icon,
    });
    await TrackPlayer.play();
}

/**
 * Adds a list of tracks to the queue.
 *
 * @param props The tracks to add to the queue.
 */
async function queue(props: {
    tracks: TrackInfo[];
    clear?: boolean;
    shuffle?: boolean;
    start?: boolean;
}): Promise<void> {
    let tracks = props.tracks;
    if (tracks == null || tracks.length == 0) return;

    if (props.clear) {
        await TrackPlayer.reset();
    }

    if (props.shuffle) {
        tracks = tracks.sort(() => Math.random() - 0.5);
    }

    await TrackPlayer.add(tracks);
    if (props.start) {
        await TrackPlayer.play();
    }
}

/**
 * Shuffles the track queue.
 */
async function shuffle(): Promise<void> {
    let queue = await TrackPlayer.getQueue();
    queue = queue.sort(() => Math.random() - 0.5);

    await TrackPlayer.setQueue(queue);
}

export default {
    play,
    queue,
    shuffle
};
