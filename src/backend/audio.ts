import type { Track } from "react-native-track-player";
import type { TrackData } from "@backend/types";

import * as fs from "@backend/fs";
import { getStreamingUrl } from "@backend/gateway";
import TrackPlayer, { Event } from "react-native-track-player";

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
 */
export async function playTrack(track: TrackData, play = true): Promise<void> {
    // Add the track to the player.
    await TrackPlayer.add(asTrack(track));
    // Play the track if specified.
    play && await TrackPlayer.play();
}

/**
 * Define service workers for the application.
 * Called on application registration.
 */
export async function playbackService(): Promise<void> {
    TrackPlayer.addEventListener(Event.PlaybackState, console.log);
}

export async function test(): Promise<void> {
    const track: TrackData = {
        title: "Travelogue (Global Acappella Ver.)",
        artist: "",
        icon: "https://app.seikimo.moe/proxy/dgfzSddP2IOxN_oOzGkytSjYkeKnbapvioYWp9oC_7vPudR3Ln2gF5Pw7SL3IMWNYyWIsDVp3d3nGqw4=w120-h120-l90-rj?from=cart",
        url: "http://10.0.2.2:3000/download?id=n-HypaOLx_s&engine=YouTube",
        id: "n-HypaOLx_s",
        duration: 186
    };

    // await download(track);
    await TrackPlayer.add([asTrack(track)]);
    await TrackPlayer.play();
}
