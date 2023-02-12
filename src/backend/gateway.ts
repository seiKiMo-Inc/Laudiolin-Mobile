import type { TrackData } from "@backend/types";

import { loadRecents, token, recents } from "@backend/user";
import { asData, getCurrentTrack, syncToTrack } from "@backend/audio";
import { Gateway } from "@app/constants";
import emitter from "@backend/events";

import TrackPlayer, { Event } from "react-native-track-player";

import { console } from "@app/utils";
import { Platform } from "react-native";

let retryToken: any = null;
export let connected: boolean = false;
export let gateway: WebSocket | null = null;
const messageQueue: object[] = [];

/**
 * Sets up track player listeners.
 */
export function setupListeners(): void {
    // Add remote event listeners.
    TrackPlayer.addEventListener(Event.RemotePlay, () => update());
    TrackPlayer.addEventListener(Event.RemoteStop, () => update());
    TrackPlayer.addEventListener(Event.RemoteSeek, () => update());
    TrackPlayer.addEventListener(Event.RemoteNext, () => update());
    TrackPlayer.addEventListener(Event.RemoteDuck, () => update());
    TrackPlayer.addEventListener(Event.RemotePause, () => update());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => update());
    Platform.OS == "android" && TrackPlayer.addEventListener(Event.RemoteSkip, () => update());

    // Add playback event listeners.
    TrackPlayer.addEventListener(Event.PlaybackState, () => update());
    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, () => update(false));
}

/**
 * Updates the current track info.
 */
async function update(shouldSync: boolean = true): Promise<void> {
    // Check if the track is playing.
    const currentTrack = await getCurrentTrack();
    // Check if the track is a local track.
    const url = currentTrack?.url as string;
    if (url && url.startsWith("file://")) return;

    // Send player information to the gateway.
    sendGatewayMessage(<NowPlayingMessage>{
        type: "playing",
        timestamp: Date.now(),
        sync: shouldSync,
        seek: await TrackPlayer.getPosition(),
        track: currentTrack ? asData(currentTrack) : null
    });
}

/**
 * Sets up the gateway.
 */
export function connect(): void {
    console.info("Connecting to gateway...");

    // Create a WebSocket.
    gateway = new WebSocket(Gateway.socket);
    // Add the event listeners.
    gateway.onopen = onOpen;
    gateway.onclose = onClose;
    gateway.onmessage = onMessage;
    gateway.onerror = onError;
}

/**
 * Invoked when the gateway is opened.
 */
function onOpen(): void {
    console.info("Connected to the gateway.");

    // Remove the retry token.
    retryToken && clearTimeout(retryToken);
}

/**
 * Invoked when the gateway closes.
 */
function onClose(): void {
    console.info("Disconnected from the gateway.");

    // Reset the connection state.
    connected = false;

    // Retry the connection.
    // TODO: Pause when the device closes the app.
    // retryToken = setTimeout(connect, 5000);
}

/**
 * Invoked when the gateway receives a message.
 * @param event The WebSocket message event.
 */
async function onMessage(event: WebSocketMessageEvent): Promise<void> {
    // Parse the message data.
    let message: BaseGatewayMessage|null = null; try {
        message = JSON.parse(event.data);
    } catch {
        console.error("Failed to parse message data."); return;
    }

    if (message?.type != "latency")
        console.info(message);

    // Handle the message data.
    switch (message?.type) {
        case "initialize":
            gateway?.send(
                JSON.stringify(<InitializeMessage>{
                    type: "initialize",
                    token: await token()
                })
            );

            // Log gateway handshake.
            console.info("Gateway handshake complete.");

            // Set connected to true.
            connected = true;
            // Send all queued messages.
            messageQueue.forEach((message) => sendGatewayMessage(message));

            return;
        case "latency":
            gateway?.send(
                JSON.stringify(<LatencyMessage>{
                    type: "latency"
                })
            );
            return;
        case "sync":
            const { track, progress } = message as SyncMessage;

            // Pass the message to the player.
            await syncToTrack(track, progress);
            return;
        case "recents":
            const { recents } = message as RecentsMessage;

            await loadRecents(recents); // Load the recents.
            emitter.emit("recent"); // Emit the recents event.
            return;
    }
}

/**
 * Invoked when the gateway encounters an error.
 */
function onError(): void {
    console.error("Gateway error.");
}

/**
 * Sends a message to the gateway.
 * @param message The raw message data.
 */
export function sendGatewayMessage(message: object) {
    if (!connected) {
        // Queue the message.
        messageQueue.push(message);
        return;
    }

    // Send the message to the gateway.
    gateway?.send(JSON.stringify(message));
}

/**
 * Returns the URL for audio playback.
 * @param track The track to get the URL for.
 */
export function getStreamingUrl(track: TrackData): string {
    return `${Gateway.url}/download?id=${track.id}`;
}

/**
 * Tells the gateway to sync the audio between this client and the specified user.
 * @param userId The user ID to sync with.
 */
export function listenAlongWith(userId: string): void {
    sendGatewayMessage(<ListenMessage>{
        type: "listen",
        with: userId
    });
}

type BaseGatewayMessage = {
    type: string;
    timestamp: number;
};

// To server.
export type InitializeMessage = BaseGatewayMessage & {
    type: "initialize";
    token?: string;
};
// To server.
export type LatencyMessage = BaseGatewayMessage & {
    type: "latency";
};
// To server.
export type NowPlayingMessage = BaseGatewayMessage & {
    type: "playing";
    track: TrackData | null;
    seek: number;
};
/**
 * From server.
 * @param with The user ID of the person to listen along with. Can be null to stop.
 */
export type ListenMessage = BaseGatewayMessage & {
    type: "listen";
    with: string;
}
// To client.
export type SyncMessage = BaseGatewayMessage & {
    type: "sync";
    track: TrackData | null;
    progress: number;
};
// To client.
export type RecentsMessage = BaseGatewayMessage & {
    type: "recents";
    recents: TrackData[];
};
