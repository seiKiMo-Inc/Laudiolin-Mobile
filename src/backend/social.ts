import * as Linking from "expo-linking";
import { logger } from "react-native-logs";
import { NavigationContainerRef } from "@react-navigation/core";

import { RefObject } from "react";
import Backend from "@backend/backend";
import Player from "@backend/player";

/*
 * Deep links can be the following:
 * - laudiolin://play?id={{ TRACK_ID }}
 * - laudiolin://listen?id={{ USER_ID }}
 * - laudiolin://login?token={{ LOGIN_TOKEN }}
 * - laudiolin://playlist?id={{ PLAYLIST_ID }}
 *
 * Universal/website links can be the following:
 * - https://laudiol.in/track/{{ TRACK_ID }}
 * - https://laudiol.in/playlist/{{ PLAYLIST_ID }}
 * - https://laudiol.in/listen/{{ USER_ID }}
 */

const log = logger.createLogger();
const deepLinks = ["play", "listen", "login", "playlist"];
const webLinks = ["track", "playlist", "listen"];

/**
 * Registers event listeners for social functionality.
 */
function setup(navigation: RefObject<NavigationContainerRef<any>>): void {
    // Listen for deep links.
    Linking.addEventListener("url", async ({ url }) => {
        const navigator = navigation?.current;
        const { scheme, hostname, queryParams, path } = Linking.parse(url);

        let action: string, param: string, value: string;

        if (scheme == "laudiolin") {
            action = hostname ?? "";

            const params = Object.keys(queryParams ?? {});
            param = params[0] ?? "";

            const values = queryParams?.[param] ?? "";
            value = Array.isArray(values) ? values[0] : values;

            if (!deepLinks.includes(action)) {
                log.warn("Unknown deep link:", url);
                return;
            }
        } else {
            const split = path?.split("/");
            if (!split) return;

            action = split[0];
            param = "";
            value = split[1];

            if (!webLinks.includes(action)) {
                log.warn("Unknown universal link:", url);
                return;
            }
        }

        switch (action) {
            case "play":
            case "track":
                if (param && param != "id") return;
                navigator?.navigate("Track", { id: value });

                if (action == "play") {
                    const track = await Backend.fetchTrack(value);
                    track && await Player.play(track, { skip: true });
                }
                return;
            case "playlist":
                if (param && param != "id") return;
                navigator?.navigate("Playlist", { playlistId: value });
                return;
            case "listen":
                // TODO: Implement listening along.
                return;
        }
    });
}

export default {
    setup
};
