import TrackPlayer, { Event, State } from "react-native-track-player";

import User from "@backend/user";
import Backend from "@backend/backend";
import { usePlayer } from "@backend/player";
import { useSettings, useUser } from "@backend/stores";

/**
 * Registers event listeners for social functionality.
 */
function setup(): void {
    // Wait for the player to update.
    TrackPlayer.addEventListener(Event.PlaybackState, async ({ state }) => {
        if (state == State.Paused || state == State.Playing) {
            await updatePresence();
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
    setup
};
