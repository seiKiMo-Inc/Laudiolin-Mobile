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

export let connected: boolean = false;
export let gateway: WebSocket | null = null;
const messageQueue: BaseGatewayMessage[] = [];

/**
 * Sets up track player listeners.
 */
export function setupListeners(): void {
    const playerSync = (time?: number) => {
        update() // Update the player progress.
            .catch(err => console.warn(err));
        playerUpdate(time) // Update the player status.
            .catch(err => console.warn(err));
    };

    // Add remote event listeners.
    TrackPlayer.addEventListener(Event.RemotePlay, playerSync);
    TrackPlayer.addEventListener(Event.RemoteStop, playerSync);
    TrackPlayer.addEventListener(Event.RemoteSeek, () => playerSync());
    TrackPlayer.addEventListener(Event.RemoteNext, playerSync);
    TrackPlayer.addEventListener(Event.RemotePause, playerSync);
    TrackPlayer.addEventListener(Event.RemotePrevious, playerSync);
    Platform.OS == "android" && TrackPlayer.addEventListener(Event.RemoteSkip, () => playerSync());

    // Add playback event listeners.
    emitter.on("seek", time => playerSync(time));
    TrackPlayer.addEventListener(Event.PlaybackState, () => playerSync());
    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, () => update());
}

/**
 * Updates the current track info.
 */
async function update(): Promise<void> {
    // Check if the track is playing.
    const currentTrack = await getCurrentTrack();
    // Check if the track is a local track.
    const url = currentTrack?.url as string;
    if (url && url.startsWith("file://")) return;

    // Send player information to the gateway.
    sendGatewayMessage(<SeekMessage> {
        type: "seek",
        timestamp: Date.now(),
        seek: await TrackPlayer.getPosition()
    });
}

/**
 * Updates the player details on the backend.
 */
async function playerUpdate(seek?: number): Promise<void> {
    // Check if the track is playing.
    const currentTrack = await getCurrentTrack();
    // Check if the track is a local track.
    const url = currentTrack?.url as string;
    if (url && url.startsWith("file://")) return;

    // Send player information to the gateway.
    sendGatewayMessage(<PlayerMessage> {
        type: "player",
        seek: seek ?? await TrackPlayer.getPosition(),
        track: currentTrack ? asData(currentTrack) : null,
        paused: await TrackPlayer.getState() == State.Paused,
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
}

/**
 * Invoked when the gateway closes.
 */
function onClose(close: any): void {
    console.info("Disconnected from the gateway.", close);

    // Reset the connection state.
    connected = false;
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
            // Send another latency ping after 10s.
            setTimeout(() => sendGatewayMessage(
                <LatencyMessage> { type: "latency" }), 10e3);
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
            broadcast: system().broadcast_listening,
            presence: system().presence
        }));
    } catch (err) {
        console.error("Failed to send initialize message.", err);
    }
}

/**
 * Sends a message to the gateway.
 * @param message The raw message data.
 */
export function sendGatewayMessage(message: BaseGatewayMessage) {
    if (!connected) {
        // Queue the message.
        messageQueue.push(message);
        return;
    }

    // Check if the message contains the proper fields.
    if (!message.type) throw new Error("Message type is required.");
    if (!message.timestamp) message.timestamp = Date.now();

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
    presence?: string;
};
// To server.
export type LatencyMessage = BaseGatewayMessage & {
    type: "latency";
};
// To server.
export type SeekMessage = BaseGatewayMessage & {
    type: "seek";
    seek: number;
};
/**
 * From server.
 * @param with The user ID of the person to listen along with. Can be null to stop.
 */
export type ListenMessage = BaseGatewayMessage & {
    type: "listen";
    with: string;
};
// From server.
export type PlayerMessage = BaseGatewayMessage & {
    type: "player";
    track: TrackData | null;
    seek: number; // Track progress.
    paused: boolean; // Is the player paused.
};

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
