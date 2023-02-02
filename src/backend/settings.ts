import type { UserSettings, SearchSettings, AudioSettings, UISettings } from "@backend/types";

import EncryptedStorage from "react-native-encrypted-storage";

let settings: UserSettings | null = null;
export const defaultSettings: UserSettings = {
    search: {
        accuracy: true,
        engine: "All"
    },
    audio: {

    },
    ui: {
        background_color: "",
        background_url: ""
    },
    token: ""
};

/**
 * Loads settings from the settings file.
 */
export async function reloadSettings(from?: UserSettings | null) {
    if (!from) {
        settings = !(await exists("settings")) ? defaultSettings :
            JSON.parse(await EncryptedStorage.getItem("settings") as string);
    } else settings = from;

    // Save the user's authentication token.
    await save("user_token", settings?.token ?? "");
}

/*
 * Settings utilities.
 */

/**
 * Returns the cached user settings.
 * Use {@link #reloadSettings} to update the settings.
 */
export function getSettings(): UserSettings | null {
    return settings;
}

/**
 * Sets the user's token.
 * @param token The token.
 */
export async function setToken(token: string): Promise<void> {
    if (!settings) return;

    // Set the token in the settings.
    settings.token = token;
    await saveSettings(settings);
    await reloadSettings(settings);
}

/**
 * Saves the specified settings to the settings file.
 * @param newSettings The settings to save.
 */
export async function saveSettings(newSettings: UserSettings): Promise<void> {
    await save("settings", JSON.stringify(newSettings));
    await reloadSettings(newSettings);
}

/**
 * Returns the cached user settings.
 */
export function search(): SearchSettings {
    return (
        settings?.search || {
            accuracy: false,
            engine: "All"
        }
    );
}

/**
 * Returns the cached user settings.
 */
export function audio(): AudioSettings {
    return settings?.audio || {};
}

/**
 * Returns the cached user settings.
 */
export function ui(): UISettings {
    return settings?.ui || <UISettings> {};
}

/*
 * Local storage utilities.
 */

/**
 * Returns the value of the specified key in local storage.
 * @param key The key to get the value of.
 * @param fallback The fallback value to return if the key does not exist.
 */
export async function get(key: string, fallback: string | null = null): Promise<string | null> {
    try {
        return await EncryptedStorage.getItem(key) ?? fallback;
    } catch {
        return fallback;
    }
}

/**
 * Sets the value of the specified key in local storage.
 * @param key The key to set the value of.
 * @param value The value to set.
 */
export async function save(key: string, value: string = ""): Promise<void> {
    try {
        return await EncryptedStorage.setItem(key, value);
    } catch {

    }
}

/**
 * Removes the specified key from local storage.
 * @param key The key to remove.
 */
export async function remove(key: string): Promise<void> {
    try {
        return await EncryptedStorage.removeItem(key);
    } catch {

    }
}

/**
 * Checks if the specified key exists in local storage.
 * @param key The key to check.
 */
export async function exists(key: string): Promise<boolean> {
    try {
        return await EncryptedStorage.getItem(key) !== null;
    } catch {
        return false;
    }
}
