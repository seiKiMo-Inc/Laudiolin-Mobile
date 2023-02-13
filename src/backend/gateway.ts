import { Platform } from "react-native";

import type { TrackData } from "@backend/types";

import { loadRecents, token, recents } from "@backend/user";
import { asData, getCurrentTrack, syncToTrack } from "@backend/audio";
import { listenWith } from "@backend/social";
import { system } from "@backend/settings";
import { Gateway } from "@app/constants";
import emitter from "@backend/events";

import TrackPlayer, { Event, State } from "react-native-track-player";

import { console } from "@app/utils";

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
    TrackPlayer.addEventListener(Event.RemoteSeek, () => update(true, true));
    TrackPlayer.addEventListener(Event.RemoteNext, () => update());
    TrackPlayer.addEventListener(Event.RemoteDuck, () => update());
    TrackPlayer.addEventListener(Event.RemotePause, () => update());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => update());
    Platform.OS == "android" && TrackPlayer.addEventListener(Event.RemoteSkip, () => update());

    // Add playback event listeners.
    emitter.on("seek", () => update(true, true));
    TrackPlayer.addEventListener(Event.PlaybackState, () => update());
    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, () => update(false));

    // Add app state listeners.
    emitter.on("appState", state => {
        if (connected) return;
        if (state == "background") {
            clearTimeout(retryToken);
        } else if (state == "active") {
            connect();
        }
    });
}

/**
 * Updates the current track info.
 */
async function update(
    shouldSync: boolean = true,
    wasSeek: boolean = false
): Promise<void> {
    // Check if the track is playing.
    const currentTrack = await getCurrentTrack();
    // Check if the track is a local track.
    const url = currentTrack?.url as string;
    if (url && url.startsWith("file://")) return;

    // Send player information to the gateway.
    sendGatewayMessage(<NowPlayingMessage>{
        type: "playing",
        timestamp: Date.now(),
        seeked: wasSeek,
        sync: shouldSync,
        seek: await TrackPlayer.getPosition(),
        paused: await TrackPlayer.getState() == State.Paused,
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

    // Wait for the gateway to be ready.
    let wait = setInterval(async () => {
        // Check the state of the gateway.
        if (gateway?.readyState != WebSocket.OPEN) return;
        clearInterval(wait);

        // Send the initialization message.
        await sendInitMessage();
        // Log gateway handshake.
        console.info("Gateway handshake complete.");

        // Set connected to true.
        connected = true;
        // Send all queued messages.
        messageQueue.forEach((message) => sendGatewayMessage(message));
    }, 500)

    // Remove the retry token.
    retryToken && clearTimeout(retryToken);
}

/**
 * Invoked when the gateway closes.
 */
function onClose(close: any): void {
    console.info("Disconnected from the gateway.", close);

    // Reset the connection state.
    connected = false;

    // Retry the connection.
    retryToken = setTimeout(() => {
        retryToken && !connected && connect();
    }, 5000);
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

    // Handle the message data.
    switch (message?.type) {
        case "initialize":
            return;
        case "latency":
            sendGatewayMessage(<LatencyMessage> {
                type: "latency"
            });
            return;
        case "sync":
            const { track, progress, paused, seek } = message as SyncMessage;

            // Validate the track.
            if (track == null && progress == -1) {
                await listenWith(null); // Stop listening along.
            }

            // Pass the message to the player.
            await syncToTrack(track, progress, paused, seek);
            return;
        case "recents":
            const { recents } = message as RecentsMessage;

            await loadRecents(recents); // Load the recents.
            emitter.emit("recent"); // Emit the recents event.
            return;
        default:
            console.warn(message);
            return;
    }
}

/**
 * Invoked when the gateway encounters an error.
 */
function onError(error: any): void {
    console.error("Gateway error.", error, Gateway.socket);
}

/**
 * Sends the initialization message to the gateway.
 */
async function sendInitMessage(): Promise<void> {
    try {
        gateway?.send(JSON.stringify(<InitializeMessage> {
            type: "initialize",
            token: await token(),
            broadcast: system().broadcast_listening
        }));
    } catch (err) {
        console.error("Failed to send initialize message.", err);
    }
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
    if (gateway && gateway.readyState == WebSocket.OPEN)
        gateway.send(JSON.stringify(message));
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
export function listenAlongWith(userId: string | null): void {
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
    broadcast?: string;
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
    sync: boolean;
    paused: boolean;
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
    paused: boolean;
    seek: boolean;
};
// To client.
export type RecentsMessage = BaseGatewayMessage & {
    type: "recents";
    recents: TrackData[];
};
