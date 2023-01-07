import EncryptedStorage from "react-native-encrypted-storage";

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
export async function save(key: string, value: string): Promise<void> {
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
