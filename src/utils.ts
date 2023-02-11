import { Linking } from "react-native";

import * as fs from "@backend/fs";
import * as settings from "@backend/settings";

import emitter from "@backend/events";
import { Gateway } from "@app/constants";
import { getCurrentTrack, playTrack } from "@backend/audio";
import { fetchTrackById } from "@backend/search";
import { addTrackToPlaylist } from "@backend/playlist";
import { loadPlaylists } from "@backend/user";

import type { TrackData, PlaylistSelectInfo, Playlist } from "@backend/types";
import type { Track } from "react-native-track-player";

import { logger } from "react-native-logs";
export const console = logger.createLogger();

/**
 * Matches the icon URL to the correct proxy URL.
 * @param track The track to get the icon URL for.
 */
export function getIconUrl(track: TrackData): string {
    const icon = track.icon;
    // Check if the icon is already a proxy.
    if (icon.includes("/proxy/")) return icon;
    // Check if the icon is a local image.
    if (icon.includes("file://")) return icon;
    // Check if the icon is blank.
    if (icon == "") return `file://${fs.getIconPath(track)}`;

    let url = `${Gateway.url}/proxy/{ico}?from={src}`;
    // Match the icon URL to the correct proxy URL.
    const iconUrl = track.icon;
    let split = iconUrl.split("/");

    if (iconUrl.includes("i.ytimg.com")) {
        return url
            .replace("{ico}", split[4])
            .replace("{src}", "yt");
    }
    if (iconUrl.includes("i.scdn.co")) {
        return url
            .replace("{ico}", split[4])
            .replace("{src}", "spot");
    }
    if (iconUrl.includes("lh3.googleusercontent.com")) {
        return url
            .replace("{ico}", split[3])
            .replace("{src}", "cart");
    }

    return url;
}

/**
 * Gets the original URL of the track.
 * @param id The ID of the track to get the URL for.
 */
export async function getOriginalUrl(id: string): Promise<string> {
    console.info(await fetchSpotifyId(id))

    switch (id.length) {
        case 11: return `https://www.youtube.com/watch?v=${id}`;
        case 12: return `https://open.spotify.com/track/${await fetchSpotifyId(id)}`;
        default: return `https://laudiolin.seikimo.moe/track/${id}`;
    }
}

/**
 * Gets the Spotify ID from the ISRC.
 * @param isrc The ISRC of the track to get the Spotify ID for.
 */
export async function fetchSpotifyId(isrc: string): Promise<string> {
    // Perform a request to the gateway.
    const response = await fetch(`${Gateway.url}/reverse/${isrc}`);

    // Check if the response is valid.
    if (response.status != 301) return "";
    // Return the Spotify ID.
    return (await response.json()).id;
}

/**
 * Attempts to open the track in the web browser.
 * @param track The track to open.
 */
export async function openTrack(track: Track|TrackData): Promise<void> {
    openUrl(await getOriginalUrl(track.id as string));
}

/**
 * Attempts to open the URL in the web browser.
 * @param url The URL to open.
 */
export function openUrl(url: string): void {
    Linking.openURL(url)
        .catch(error => console.error(`Failed to open URL: ${error}`));
}

/**
 * Saves the current player state to the local storage.
 */
export async function savePlayerState(): Promise<void> {
    // Get the current track.
    const track = await getCurrentTrack();

    // Check if the track is valid.
    if (track)
        // Save the current track.
        await settings.save("player.currentTrack", track.id);
    else
        // Remove the current track.
        await settings.remove("player.currentTrack");
}

/**
 * Loads the player state from the local storage.
 */
export async function loadPlayerState(): Promise<void> {
    // Check if a track is saved.
    const track = await settings.get("player.currentTrack");
    // Check if the track is valid.
    if (!track) return;

    // Get the track as a serialized data object.
    const data = await fetchTrackById(track);
    // Check if the track is valid.
    if (!data) return;

    // Add the track to the queue.
    await playTrack(data, false, true);
    // Remove the track from the local storage.
    await settings.remove("player.currentTrack");
}

/**
 * Prompts the user to add a track to a playlist.
 * @param track The track to add to a playlist.
 */
export function promptPlaylistTrackAdd(track: TrackData): void {
    emitter.emit("selectPlaylist", <PlaylistSelectInfo> {
        title: "Add Track to Playlist",
        callback: (playlist: Playlist) => {
            addTrackToPlaylist(playlist?.id ?? "", track)
                .then(async result => {
                    // TODO: Send success notification.
                    // Reload all playlists.
                    await loadPlaylists();
                })
                .catch(err => console.error(err));
        }
    });
}
