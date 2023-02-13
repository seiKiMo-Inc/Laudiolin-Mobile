import { Platform } from "react-native";
import type { Track } from "react-native-track-player";
import type { Playlist, TrackData } from "@backend/types";

import * as fs from "@backend/fs";
import emitter from "@backend/events";
import { Gateway } from "@app/constants";
import { getIconUrl } from "@app/utils";
import { doSearch } from "@backend/search";
import { getStreamingUrl } from "@backend/gateway";
import { setCurrentPlaylist } from "@backend/playlist";
import { dismiss, notify } from "@backend/notifications";
import { isListeningWith, listenWith } from "@backend/social";

import TrackPlayer, { Event, State } from "react-native-track-player";
import { RepeatMode } from "react-native-track-player/lib/interfaces";

export let forcePause = false; // Should the player be paused?

/**
 * Sets the force pause value.
 * @param value The new force pause value.
 */
export function setForcePause(value: boolean): void {
    forcePause = value;
}

/**
 * Converts a local track data object to a track player object.
 * Use this method to get an object to play from TrackPlayer.
 * @param trackData The track data object.
 * @param local Is the track local?
 * @return A track player object.
 */
export function asTrack(trackData: TrackData, local = false): Track {
    return {
        id: trackData.id,
        url: local ? `file://${fs.getTrackPath(trackData)}` : getStreamingUrl(trackData),
        artwork: local ? `file://${fs.getIconPath(trackData)}` : getIconUrl(trackData),
        contentType: "audio/mpeg",
        title: trackData.title,
        artist: trackData.artist,
        duration: trackData.duration
    };
}

/**
 * Converts a track player object into a local track data object.
 * Use this method to get a serialized object from TrackPlayer.
 * @param track A track player object.
 * @return A track data object.
 */
export function asData(track: Track): TrackData {
    return {
        id: track.id ?? "",
        title: track.title ?? "",
        artist: track.artist ?? "",
        duration: track.duration ?? 0,
        url: <string> track.url ?? "",
        icon: <string> track.artwork ?? ""
    };
}

/**
 * Downloads a track and saves it to the file system.
 * @param track The track to download.
 * @param emit Should the download event be emitted?
 */
export async function downloadTrack(track: TrackData, emit = true): Promise<void> {
    if (await fs.trackExists(track)) {
        return;
    }

    // Create the track's folder.
    await fs.createTrackFolder(track);
    // Download the track data as necessary.
    await fs.downloadUrl(getStreamingUrl(track), fs.getTrackPath(track));
    await fs.downloadUrl(getIconUrl(track), fs.getIconPath(track));
    // Save the track's data.
    track.icon = `file://${fs.getIconPath(track)}`;
    track.url = `file://${fs.getTrackPath(track)}`;
    await fs.saveData(track, fs.getDataPath(track));

    if (emit) {
        // Emit the track downloaded event.
        emitter.emit("download");
        // Send a notification.
        await notify({
            type: "info",
            message: `Finished downloading ${track.title}`,
            date: new Date(),
            icon: "file-download",
            onPress: dismiss
        });
    }
}

/**
 * Deletes a track from the file system.
 * @param track The local track to delete.
 */
export async function deleteTrack(track: TrackData): Promise<void> {
    // Delete the track's folder.
    await fs.deleteTrackFolder(track);

    // Emit the track deleted event.
    emitter.emit("delete");
}

/**
 * Adds the specified track to the queue.
 * Plays the track if specified.
 * @param track The track to add.
 * @param play Should the track be played?
 * @param force Should this track be played now?
 * @param local Is this track local?
 * @param fromPlaylist Is this track from a playlist?
 * @param fromHost Is this track from the host?
 */
export async function playTrack(
    track: TrackData,
    play = true,
    force = false,
    local = false,
    fromPlaylist = false,
    fromHost = false
): Promise<void> {
    let trackData = asTrack(track, local);
    // Check if the track has been downloaded.
    if (!local && await fs.trackExists(track)) {
        trackData = await fs.loadLocalTrack(track.id);
        trackData.original = { ...track, artwork: track.icon };
    }

    // Reset the listening state.
    if (isListeningWith() && !fromHost) {
        await listenWith(null);
        setForcePause(false);
    }

    // Add the track to the player.
    TrackPlayer.add(trackData)
        .then(async () => {
            // Play the track if specified.
            play && await TrackPlayer.play();
            // Skip to the track if specified.
            play && force && await TrackPlayer.skip((
                await TrackPlayer.getQueue()).length - 1);
        })
        .catch(err => console.error(err));

    // Reset the current playlist.
    !fromPlaylist && setCurrentPlaylist(null);
}

/**
 * Shuffles the player queue.
 */
export async function shuffleQueue(): Promise<void> {
    // Pull the current queue and reset it.
    let queue = await TrackPlayer.getQueue();
    await TrackPlayer.removeUpcomingTracks();

    // Shuffle the pulled queue.
    queue = queue.sort(() => Math.random () - 0.5);
    // Re-queue the tracks.
    await TrackPlayer.add(queue);
    // Resume the player.
    await TrackPlayer.play();
}

/**
 * Toggles the repeat state of the player.
 */
export async function toggleRepeatState(): Promise<void> {
    // Get the current repeat state.
    const state = await TrackPlayer.getRepeatMode();

    // Set the repeat state.
    switch (state) {
        case RepeatMode.Off:
            await TrackPlayer.setRepeatMode(RepeatMode.Queue);
            break;
        case RepeatMode.Queue:
            await TrackPlayer.setRepeatMode(RepeatMode.Track);
            break;
        case RepeatMode.Track:
            await TrackPlayer.setRepeatMode(RepeatMode.Off);
            break;
    }
}

/**
 * Gets the currently playing track from the player.
 */
export async function getCurrentTrack(): Promise<Track|null> {
    const playerResult = (await TrackPlayer.getQueue())[(await TrackPlayer.getCurrentTrack()) ?? 0];
    return playerResult ? (playerResult.original ?? playerResult) : null;
}

/**
 * Syncs the current player to the specified track.
 * @param track The track to sync to.
 * @param progress The progress to sync to.
 * @param paused Is the player paused?
 * @param seek Should the player seek?
 */
export async function syncToTrack(
    track: TrackData|null,
    progress: number,
    paused: boolean,
    seek: boolean
): Promise<void> {
    // Reset the player if the track is null.
    if (track == null) {
        await TrackPlayer.reset(); return;
    }

    // Check if the track needs to be played.
    const playing = await getCurrentTrack();
    if (playing?.id != track.id) {
        // Play the track.
        await playTrack(track, true, true, false, false, true);
    }

    // Set the progress.
    seek && await TrackPlayer.seekTo(progress);

    // Set the player's state.
    if (paused) {
        setForcePause(true);
        await TrackPlayer.pause();
    } else {
        setForcePause(false);
        await TrackPlayer.play();
    }
}

/**
 * Plays the tracks in the playlist.
 * @param playlist The playlist to play.
 * @param shuffle Should the playlist be shuffled?
 */
export async function playPlaylist(playlist: Playlist, shuffle: boolean): Promise<void> {
    // Reset the queue.
    await TrackPlayer.reset();

    // Fetch the tracks.
    let tracks = playlist.tracks
        // Remove duplicate tracks.
        .filter((track, index, self) => {
            return self.findIndex(t => t.id == track.id) == index;
        });
    // Shuffle the tracks.
    shuffle && (tracks = tracks.sort(() => Math.random() - 0.5));
    // Add all tracks in the playlist to the queue.
    for (const track of tracks) {
        await playTrack(track, false, false, false, true);
    }

    // Play the player.
    await TrackPlayer.play();
    // Set the current playlist.
    setCurrentPlaylist(playlist);
}

/**
 * Define service workers for the application.
 * Called on application registration.
 */
export async function playbackService(): Promise<void> {
    TrackPlayer.addEventListener(Event.PlaybackState, async ({ state }) => {
        if (state == State.Stopped)
            await TrackPlayer.reset();
        if (state == State.Ready) {
            if (forcePause) await TrackPlayer.pause();
            else await TrackPlayer.play();
        }
        if (state == State.Playing) {
            // Check if there are additional tracks in queue.
            const queue = await TrackPlayer.getQueue();
            if (queue.length == 1) return;

            // Get the next track.
            const nextTrack = queue[1];
            // Check if the next track is local.
            if (nextTrack["original"] != null) return;
            // Check if the next track has been downloaded.
            if (await fs.trackExists(asData(nextTrack))) return;

            // Pre-fetch the next track.
            await fetch(`${Gateway.url}/cache?id=${nextTrack.id}`);
        }
    });

    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.reset());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => TrackPlayer.seekTo(position));
    TrackPlayer.addEventListener(Event.RemoteDuck, ({ paused }) => paused ? TrackPlayer.pause() : TrackPlayer.play());

    if (Platform.OS == "android") {
        TrackPlayer.addEventListener(Event.RemoteSkip, () => TrackPlayer.skipToNext());
        TrackPlayer.addEventListener(Event.RemotePlaySearch, async ({ query }) => {
            // Search for the song.
            const track = await doSearch(query);
            // Play the song if found.
            track.top && await playTrack(track.top, true, true);
        });
    }
}
