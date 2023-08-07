import { Linking } from "react-native";

import * as settings from "@backend/settings";
import { login } from "@backend/user";
import { listenWith } from "@backend/social";
import { navigate } from "@backend/navigation";
import { console } from "@app/utils";
import { fetchTrackById } from "@backend/search";
import { playTrack } from "@backend/audio";
import { getPlaylistById } from "@backend/playlist";
import emitter from "@backend/events";

/*
 * Deep links:
 * - laudiolin://play?id=
 * - laudiolin://listen?user=
 * - laudiolin://playlist?id=
 */

let _unsubscribe: any = null;

/**
 * Sets up event listeners.
 */
export async function setupListeners() {
    _unsubscribe = Linking.addEventListener("url",
        ({ url }) => onLinked(url));

    // Invoke the onLinked function with the initial URL.
    const url = await Linking.getInitialURL();
    url && await onLinked(url);
}

/**
 * Invoked when a deep link call is received.
 * @param payload The URL invoked through the deep link.
 */
async function onLinked(payload: string) {
    // Validate the payload.
    if (!payload.startsWith("laudiolin://"))
        return;

    // Parse the payload.
    const data = payload.split(":")[1];
    const query = data.split("/")[2]
        .split("?")[0];

    let param = "", action = "", value = "";
    if (payload.includes("?") && payload.includes("=")) {
        param = payload.split("?")[1];
        action = param.split("=")[0];
        value = param.split("=")[1];
    }

    switch (query) {
        default:
            console.error("Unknown query: " + query);
            return;
        case "play":
            if (action != "id") break;

            // Fetch the track by ID.
            const track = await fetchTrackById(value);
            // Play the track.
            track && await playTrack(track, true, true);
            break;
        case "listen":
            if (action != "id") break;

            // Listen to the user.
            await listenWith(value);
            break;
        case "playlist":
            if (action != "id") break;

            // Fetch the playlist by ID.
            const playlist = await getPlaylistById(value);
            // Display the playlist.
            if (playlist) {
                emitter.emit("showPlaylist", playlist);
                navigate("Playlist");
            }
            return;
        case "login":
            if (action != "token") break;
            if (await login(value)) {
                // Attempt to log in.
                await settings.setToken(value); // Save the token.
                await settings.save("authenticated", "discord");
            }
            return;
    }

    navigate("Home"); // Navigate home.
}
