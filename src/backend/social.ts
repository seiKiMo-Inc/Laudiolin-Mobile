import * as Linking from "expo-linking";
import { logger } from "react-native-logs";
import TrackPlayer from "react-native-track-player";
import { NavigationContainerRef } from "@react-navigation/core";

import User from "@backend/user";
import Backend from "@backend/backend";
import { usePlayer } from "@backend/player";
import { useSettings, useUser } from "@backend/stores";
import { RefObject } from "react";

const log = logger.createLogger();

/**
 * Registers event listeners for social functionality.
 */
function setup(navigation: RefObject<NavigationContainerRef<any>>): void {
    // Listen for deep links.
    Linking.addEventListener("url", async ({ url }) => {
        const navigator = navigation.current;
        const { scheme, hostname, queryParams, path } = Linking.parse(url);

        let action: string, param: string, value: string;

        if (scheme == "laudiolin") {
            action = hostname ?? "";

            const params = Object.keys(queryParams ?? {});
            param = params[0] ?? "";

            const values = queryParams?.[param] ?? "";
            value = Array.isArray(values) ? values[0] : values;
        } else {
            action = "";
            param = "";
            value = "";
            log.warn("Unknown deep link:", url);
        }

        switch (action) {
            case "track":
                if (param != "id") return;
                navigator!.navigate("Track", { id: value });
                return;
        }
    });
}

/**
 * Updates the Discord presence of the connected account.
 */
async function updatePresence(): Promise<void> {
    const user = useUser.getState();
    if (user == null || !user.connections?.discord) return;

    const { system } = useSettings.getState();
    if (system.presence == "None") return;

    // Read the player data.
    const { track, started, isPaused } = usePlayer.getState();
    const { duration, position } = await TrackPlayer.getProgress();

    // Update the presence.
    await fetch(`${Backend.getBaseUrl()}/social/presence`, {
        method: "POST", headers: { Authorization: await User.getToken() },
        body: JSON.stringify({
            track,
            remove: track === undefined || await isPaused(),
            broadcast: system.presence,
            started: Math.round(started + position),
            shouldEnd: Math.round(started + duration)
        })
    });
}

export default {
    setup,
    updatePresence
};
