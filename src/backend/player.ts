import { create, StoreApi, UseBoundStore } from "zustand";

import { logger } from "react-native-logs";
import { EventRegister } from "react-native-event-listeners";
import TrackPlayer, { AddTrack, Event, RepeatMode, State } from "react-native-track-player";

import Backend from "@backend/backend";
import { resolveIcon } from "@backend/utils";
import { useDebug } from "@backend/stores";
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
    TrackPlayer.addEventListener(Event.RemoteNext, () => skipToNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => TrackPlayer.seekTo(position));

    TrackPlayer.addEventListener(Event.PlaybackState, (data) => {
        if (data == undefined || data.state == undefined) {
            TrackPlayer.reset();
            log.debug("Playback state is undefined.");
            return;
        }

        if (useDebug.getState().playbackState) {
            log.info(`Playback state changed: ${data.state}`);
        }

        if (data.state == State.Error) {
            skipToNext();
        }
    });
    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, async ({ track }) => {
        if (!track) return;

        const trackInfo = track.source as TrackInfo;
        usePlayer.getState().setTrack(trackInfo);
    });
};

type PlayerType = {
    track: TrackInfo | undefined;
    started: number;

    isPaused(): Promise<boolean>;
    setTrack(track: TrackInfo): void;
};

/**
 * Creates a player object.
 */
function Player(): UseBoundStore<StoreApi<PlayerType>> {
    return create<PlayerType>((set) => ({
        track: undefined,
        started: Date.now(),

        async isPaused(): Promise<boolean> {
            const { state } = await TrackPlayer.getPlaybackState();
            return state == State.Paused;
        },
        setTrack(track: TrackInfo) {
            set({ track, started: Date.now() });
        }
    }));
}

export const usePlayer = Player();

/**
 * Transforms a track info into a track player track.
 *
 * @param track The track to transform.
 * @param playlistRef The name of the playlist the track came from.
 */
function transform(track: TrackInfo, playlistRef?: string): AddTrack {
    return track.type == "remote" ?
        {
            ...requestData,
            id: track.id,
            url: `${Backend.getBaseUrl()}/download?id=${track.id}`,
            title: track.title,
            artist: track.artist,
            artwork: resolveIcon(track.icon),
            source: track,
            playlist: playlistRef
        }
        :
        {
            id: track.id,
            url: track.filePath,
            title: track.title,
            artist: track.artist,
            artwork: track.icon,
            source: track,
            playlist: playlistRef
        };
}

type PlayProps = {
    playlist?: PlaylistInfo; // Track source playlist.
    reset?: boolean; // Should the player be reset?
    clear?: boolean; // Should the existing queue be cleared?

    /* Applies only to multiple tracks. */
    shuffle?: boolean; // Should the queue be shuffled?

    /* Applies only to single tracks. */
    skip?: boolean; // Should the player skip to the new track?
};

/**
 * Plays the track.
 *
 * @param _track The track to play.
 * @param props Additional parameters.
 */
async function play(
    _track?: TrackInfo | TrackInfo[], props?: PlayProps
): Promise<void> {
    // Create a clone of the track(s).
    let track: TrackInfo | TrackInfo[] | undefined =
        Array.isArray(_track) ? [..._track] : _track;

    // Check if no track was specified.
    if (track == undefined) {
        return await TrackPlayer.play();
    }

    // Reset track player.
    props?.reset && await TrackPlayer.reset();

    // Clear the queue.
    if (props?.clear) {
        await TrackPlayer.removeUpcomingTracks();
    }

    // Get the existing queue.
    let queue = await TrackPlayer.getQueue();

    // Shuffle the list of tracks if needed.
    let inQueue = false;
    const trackList: TrackInfo[] = [];
    if (Array.isArray(track)) {
        if (props?.shuffle) {
            track = track.sort(() => Math.random() - 0.5);
        }
        track.forEach((track) => trackList.push(track));
    } else {
        const id = track.id;
        inQueue = queue.find(t => t.id != id) != undefined;
        if (!inQueue) {
            trackList.push(track);
        }
    }

    // Add all tracks to the queue.
    for (const track of trackList) {
        await TrackPlayer.add(transform(track, props?.playlist?.name));
    }

    // Emit an event for the updated queue.
    EventRegister.emit(
        "player:updateQueue",
        await TrackPlayer.getQueue());

    if (!Array.isArray(track) && props?.skip) {
        queue = await TrackPlayer.getQueue();

        const id = track.id;
        await TrackPlayer.skip(
            queue.findIndex(t => t.id == id));
    }

    await TrackPlayer.setPlayWhenReady(true);
}

/**
 * Shuffles the track queue.
 */
async function shuffle(): Promise<void> {
    const queue = await TrackPlayer.getQueue();
    if (!queue) return;

    const shuffled = queue.sort(() => Math.random() - 0.5);
    await TrackPlayer.removeUpcomingTracks();
    await TrackPlayer.add(shuffled);
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

/**
 * Skips to the next track in the queue.
 */
async function skipToNext(): Promise<void> {
    // await play(undefined, { reset: true });
    return await TrackPlayer.skipToNext();
}

/**
 * Skips to the previous track in the queue.
 */
async function skipToPrevious(): Promise<void> {
    // const { track: currentlyPlaying } = usePlayer.getState();
    //
    // const track = backQueue.getState().dequeue();
    // if (!track) return;
    //
    // // Add the current track to the queue.
    // currentlyPlaying && useQueue.getState().enqueue(currentlyPlaying);
    //
    // await play(track, { reset: true });

    return await TrackPlayer.skipToPrevious();
}

/**
 * Sync the local player with the server.
 *
 * @param track The track to play.
 * @param progress The track progress.
 * @param paused If the track is paused.
 * @param seek The track seek position.
 */
async function sync(
    track: TrackInfo | null,
    progress: number,
    paused: boolean,
    seek: boolean
): Promise<void> {
    const { track: currentlyPlaying } = usePlayer.getState();

    // Reset the player if the track is null.
    if (track === null) {
        await TrackPlayer.reset();
        return;
    }

    // Check if the track needs to be played.
    if (currentlyPlaying?.id != track.id) {
        await play(track, { reset: true });
    }

    // Set the progress.
    seek && await TrackPlayer.seekTo(progress);

    // Set the player's state.
    if (paused) {
        await TrackPlayer.pause();
    } else {
        await TrackPlayer.play();
    }
}

export default {
    play,
    shuffle,
    nextRepeatMode,
    skipToNext,
    skipToPrevious,
    sync
};
