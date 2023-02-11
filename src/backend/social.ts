import type { OnlineUser, User } from "@backend/types";

import { getUserById } from "@backend/user";
import { listenAlongWith } from "@backend/gateway";

import emitter from "@backend/events";
import { targetRoute } from "@backend/user";
import { console } from "@app/utils";

export let listeningWith: User | null = null; // The ID of the user you are currently listening with.

/**
 * Listens along with the specified user.
 * @param user The user to listen along with.
 */
export async function listenWith(user: string | null = null): Promise<void> {
    // Set the listening with user.
    listeningWith = user ? await getUserById(user) : null;
    // Inform the gateway to sync with the specified user.
    user && listenAlongWith(user);
    // Emit the listening event.
    emitter.emit("listen", listeningWith);
}

/**
 * Gets all online users which are listening on Laudiolin.
 */
export async function getAvailableUsers(): Promise<OnlineUser[]> {
    const route = `${targetRoute}/social/available`;
    const response = await fetch(route);

    // Check the response.
    if (response.status != 200) {
        console.error(`Failed to get available users: ${response.status} ${response.statusText}`);
        return [];
    }

    // Return the users.
    return (await response.json()).onlineUsers;
}
