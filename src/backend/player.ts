import { logger } from "react-native-logs";
import TrackPlayer, { AddTrack, Event, RepeatMode, State } from "react-native-track-player";

import Backend from "@backend/backend";
import { useDebug, useGlobal } from "@backend/stores";
import { resolveIcon } from "@backend/utils";
import { PlaylistInfo, TrackInfo } from "@backend/types";

const log = logger.createLogger();

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

    TrackPlayer.addEventListener(Event.PlaybackState, (data) => {
        if (data == undefined || data.state == undefined) {
            TrackPlayer.reset();
            return;
        }

        if (useDebug.getState().playbackState) {
            log.info(`Playback state changed: ${data.state}`);
        }

        if (data.state == State.Error) {
            const state = useGlobal.getState();
            if (state.loadTries > 3) {
                log.error("Failed to load track after 3 tries.");
                useGlobal.setState({ loadTries: 0 });
                TrackPlayer.skipToNext();
            } else {
                state.incrementTries();
                TrackPlayer.retry();
            }
        }
    });
};

/**
 * Transforms a track info into a track player track.
 *
 * @param track The track to transform.
 */
function transform(track: TrackInfo): AddTrack {
    return {
        ...requestData,
        id: track.id,
        url: `${Backend.getBaseUrl()}/download?id=${track.id}`,
        title: track.title,
        artist: track.artist,
        artwork: resolveIcon(track.icon),
    };
}

/**
 * Plays a track from the given info.
 *
 * @param track The track to play.
 * @param props Additional parameters.
 */
async function play(track: TrackInfo, props: {
    playlist?: PlaylistInfo;
}): Promise<void> {
    await TrackPlayer.reset();
    await TrackPlayer.add(transform(track));
    await TrackPlayer.play();

    if (props.playlist) {
        useGlobal.setState({ fromPlaylist: props.playlist.name });
    }
}

/**
 * Adds a list of tracks to the queue.
 *
 * @param props The tracks to add to the queue.
 */
async function queue(props: {
    tracks: TrackInfo[];
    playlist?: PlaylistInfo;
    clear?: boolean;
    shuffle?: boolean;
    start?: boolean;
}): Promise<void> {
    let tracks = [...props.tracks];
    if (tracks.length == 0) return;

    if (props.clear) {
        await TrackPlayer.reset();
    }

    if (props.shuffle) {
        tracks = tracks.sort(() => Math.random() - 0.5)
    }

    await TrackPlayer.add(tracks.map(transform));
    if (props.start) {
        await TrackPlayer.play();
    }

    if (props.playlist) {
        useGlobal.setState({ fromPlaylist: props.playlist.name });
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

const nextRepeat = {
    [RepeatMode.Off]: RepeatMode.Queue,
    [RepeatMode.Queue]: RepeatMode.Track,
    [RepeatMode.Track]: RepeatMode.Off
};

/**
 * Sets the player to the next repeat mode.
 *
 * @return The new repeat mode.
 */
async function nextRepeatMode(): Promise<RepeatMode> {
    const mode = await TrackPlayer.getRepeatMode();
    const next = nextRepeat[mode];
    await TrackPlayer.setRepeatMode(next);
    return next;
}

export default {
    play,
    queue,
    shuffle,
    nextRepeatMode
};
