import { EventEmitter } from "events";

import type { InAppNotificationData } from "@backend/types";
import { get, save } from "@backend/settings";

/* Collection of notifications which haven't been dismissed. */
export let notifications: InAppNotificationData[] = [];
export const notifyEmitter = new EventEmitter();

/**
 * Loads notifications from the local storage.
 */
export async function loadNotifications() {
    // Fetch the data from the local storage.
    const data = await get("notifications", null);
    // Validate the data & import if needed.
    if (data) {
        notifications = JSON.parse(data);
        notifications.forEach(notification => {
            notification.onPress = dismiss;
            notification.update = undefined;
        });
    }

    // Emit the notification event.
    notifyEmitter.emit("notification", notifications);
}

/**
 * Saves notifications to the local storage.
 */
export async function saveNotifications() {
    // Save the notifications to the local storage.
    await save("notifications", JSON.stringify(notifications));
}

/**
 * Sends a notification.
 * @param notification The notification.
 */
export async function notify(notification: InAppNotificationData) {
    // Add the notification to the collection.
    notifications.push(notification);
    // Save the notifications.
    await saveNotifications();
    // Emit the notification event.
    notifyEmitter.emit("notification", notifications);
}

/**
 * Dismisses all notifications.
 */
export async function dismissAll() {
    // Remove the notification's listeners.
    notifications.forEach(notification => {
        notification.onPress = undefined;
        notification.update = undefined;
        notifyEmitter.removeAllListeners(notification.event);
    });
    // Clear the notifications.
    notifications = [];
    // Save the notifications.
    await saveNotifications();
    // Emit the notification event.
    notifyEmitter.emit("notification", notifications);
}

/**
 * Dismisses a notification.
 * @param index The notification index.
 */
export async function dismiss(index: number) {
    // Remove the notification from the collection.
    const [notification] = notifications.splice(index, 1);
    // Remove the notification's listeners.
    notification.onPress = undefined;
    notification.update = undefined;
    notifyEmitter.removeAllListeners(notification.event);

    // Save the notifications.
    await saveNotifications();
    // Emit the notification event.
    notifyEmitter.emit("notification", notifications);
}

/**
 * Registers a notification event listener.
 * @param listener The listener.
 */
export function registerListener(listener: (notifications: InAppNotificationData[]) => void) {
    notifyEmitter.on("notification", listener);
}

/**
 * Unregisters a notification event listener.
 * @param listener
 */
export function unregisterListener(listener: (notifications: InAppNotificationData[]) => void) {
    notifyEmitter.removeListener("notification", listener);
}
