import { logger } from "react-native-logs";
import * as SecureStore from "expo-secure-store";

import Backend from "@backend/backend";
import { useFavorites, useGlobal, usePlaylists, useRecents, useUser } from "@backend/stores";
import { PlaylistInfo, TrackInfo, User } from "@backend/types";

const log = logger.createLogger();

/**
 * Stores a user's token in the secure store.
 *
 * @param token The token to store.
 */
async function storeToken(token: string) {
    await SecureStore.setItemAsync("userToken", token);
}

/**
 * Fetches a user's token from the secure store.
 */
async function getToken(): Promise<string> {
    return (await SecureStore.getItemAsync("userToken")) ?? "";
}

/**
 * Fetches user data from the backend using a user's token.
 *
 * @param token The user's authentication token.
 */
async function login(token: string): Promise<boolean> {
    if (token == "") return false;

    const response = await fetch(`${Backend.getBaseUrl()}/user`, {
        headers: { authorization: token }, cache: "no-cache"
    });

    if (response.status != 301) {
        log.error("Failed to login", response.status);
        return false;
    }

    // Store the user's token.
    await storeToken(token);

    // Load the user data.
    useUser.setState(await response.json());
    log.info("Loaded user data!");

    loadRecents();
    loadFavorites();
    loadPlaylists()
        .catch(error => log.error("Failed to load playlists", error));

    return true;
}

/**
 * Checks if the user has to re-authenticate.
 */
async function authenticate(): Promise<void> {
    const token = await getToken();
    if (token == "") {
        useGlobal.setState({ showLoginPage: true });
        return;
    }

    if (!await login(token)) {
        useGlobal.setState({ showLoginPage: true });
    }
}

/**
 * Loads the user's recently played tracks into the store.
 * This method can also be used to replace the recents with a new list of tracks.
 *
 * @param tracks The list of tracks to replace the recents with.
 */
function loadRecents(tracks: TrackInfo[] | null = null): void {
    if (tracks) {
        useRecents.setState(tracks);
    } else {
        const user = useUser.getState() as User;
        if (!user) {
            log.warn("Unable to load recent tracks; user is not logged in.");
            return;
        }

        if (!user.recentlyPlayed) {
            log.warn("Unable to load recent tracks; user has no recents.");
            return;
        }

        useRecents.setState(user.recentlyPlayed);
        log.info(`Loaded ${user.recentlyPlayed.length} recent tracks!`);
    }
}

/**
 * Resolves the user's playlists and loads them into the store.
 */
async function loadPlaylists(): Promise<void> {
    const user = useUser.getState() as User;
    if (!user) {
        log.warn("Unable to load playlists; user is not logged in.");
        return;
    }

    if (!user.playlists) {
        log.warn("Unable to load playlists; user has no playlists.");
        return;
    }

    let playlists: PlaylistInfo[] = [];
    const route = `${Backend.getBaseUrl()}/playlist`;
    for (const id of user.playlists) {
        const response = await fetch(`${route}/${id}`, {
            headers: { authorization: await getToken() }, cache: "no-cache"
        });

        if (response.status != 301) {
            log.error("Failed to load playlist", id, response.status);
            continue;
        }

        try {
            const data = await response.json();
            playlists.push(data);
        } catch (error) {
            log.error("Failed to load playlists", error);
        }
    }

    // LEGACY: Remove duplicate playlists.
    playlists = playlists.filter((playlist, index, self) =>
        index == self.findIndex(p => p.id == playlist.id)
    );

    usePlaylists.setState(playlists);
    log.info(`Loaded ${playlists.length} playlists!`);
}

/**
 * Loads the user's favorite tracks into the store.
 */
function loadFavorites(): void {
    const user = useUser.getState() as User;
    if (!user) {
        log.warn("Unable to load favorites; user is not logged in.");
        return;
    }

    if (!user.likedSongs) {
        log.warn("Unable to load favorites; user has no favorites.");
        return;
    }

    useFavorites.setState(user.likedSongs);
    log.info(`Loaded ${user.likedSongs.length} favorite tracks!`);
}

export default {
    login,
    getToken,
    loadRecents,
    loadPlaylists
};
