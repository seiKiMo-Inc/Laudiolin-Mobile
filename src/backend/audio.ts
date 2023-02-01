import type { Track } from "react-native-track-player";
import type { TrackData } from "@backend/types";

import * as fs from "@backend/fs";
import { getStreamingUrl } from "@backend/gateway";

import TrackPlayer, { Event, State } from "react-native-track-player";

/**
 * Converts a local track data object to a track player object.
 * Use this method to get an object to play from TrackPlayer.
 * @param trackData The track data object.
 * @param local Is the track local?
 * @return A track player object.
 */
export function asTrack(trackData: TrackData, local = false): Track {
    return {
        url: local ? `file://${fs.getTrackPath(trackData)}` : getStreamingUrl(trackData),
        artwork: local ? `file://${fs.getIconPath(trackData)}` : trackData.icon,
        contentType: "audio/mpeg",
        title: trackData.title,
        artist: trackData.artist,
        duration: trackData.duration
    };
}

/**
 * Downloads a track and saves it to the file system.
 * @param track The track to download.
 */
export async function download(track: TrackData): Promise<void> {
    if (await fs.trackExists(track)) {
        return;
    }

    // Download the track data as necessary.
    await fs.downloadUrl(track.url, fs.getTrackPath(track));
    await fs.downloadUrl(track.icon, fs.getIconPath(track));
}

/**
 * Adds the specified track to the queue.
 * Plays the track if specified.
 * @param track The track to add.
 * @param play Should the track be played?
 * @param force Should this track be played now?
 */
export async function playTrack(
    track: TrackData,
    play = true,
    force = false
): Promise<void> {
    // Add the track to the player.
    await TrackPlayer.add(asTrack(track));
    // Play the track if specified.
    play && await TrackPlayer.play();
    // Skip to the track if specified.
    force && await TrackPlayer.skip((
        await TrackPlayer.getQueue()).length - 1);
}

/**
 * Shuffles the player queue.
 */
export async function shuffleQueue(): Promise<void> {
    // Pull the current queue and reset it.
    let queue = await TrackPlayer.getQueue();
    await TrackPlayer.removeUpcomingTracks();
    
    // Shuffle the pulled queue.
    queue.sort(() => Math.random () - 0.5);
    // Re-queue the tracks.
    await TrackPlayer.add(queue);
}

/**
 * Gets the currently playing track from the player.
 */
export async function getCurrentTrack(): Promise<Track|null> {
    return (await TrackPlayer.getQueue())[(await TrackPlayer.getCurrentTrack()) ?? 0];
}

/**
 * Define service workers for the application.
 * Called on application registration.
 */
export async function playbackService(): Promise<void> {
    TrackPlayer.addEventListener(Event.PlaybackState, ({ state }) => {
        if (state == State.Stopped)
            TrackPlayer.reset();
    });
}
