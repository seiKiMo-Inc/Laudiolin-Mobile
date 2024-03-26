import { logger } from "react-native-logs";
import TrackPlayer, { Event, State } from "react-native-track-player";

import { useDebug, useRecents, useSettings } from "@backend/stores";

import User from "@backend/user";
import Player, { usePlayer } from "@backend/player";
import { RemoteInfo, Synchronize, TrackInfo } from "@backend/types";

import { alert } from "@widgets/Alert";

const log = logger.createLogger();

let gateway: WebSocket | undefined = undefined;

const messageQueue: BaseGatewayMessage[] = [];
const gatewayUrl = () => useSettings.getState().system.gateway;

const updateStates = [
    State.Playing,
    State.Paused,
    State.Stopped
];

/**
 * Sets up the gateway connection.
 *
 * @param first Is this the first setup?
 */
async function setup(first: boolean = true): Promise<void> {
    if (!gateway) {
        await handshake();
    }

    // Initialize the gateway.
    await initialize();

    if (first) {
        // Register event listeners.
        TrackPlayer.addEventListener(Event.PlaybackState, ({ state }) => {
            if (updateStates.includes(state)) {
                update({ update: true });
            }
        });

        log.debug("Registered event listeners for gateway.");
    }
}

type UpdateInfo = {
    isSeek?: boolean; // Is the message a seek message?
                      // All fields will be ignored if true.
    update?: boolean; // Should clients be updated?
};

/**
 * Informs the backend of the client's state.
 *
 * @param seek Whether the client is seeking.
 */
async function update({ isSeek, update }: UpdateInfo): Promise<void> {
    const track = await TrackPlayer.getActiveTrack();
    if (track?.url.includes("file://")) return;

    const trackInfo = track?.source as TrackInfo;
    if (trackInfo.type == "download") return;

    const { state } = await TrackPlayer.getPlaybackState();
    const { position } = await TrackPlayer.getProgress();

    if (isSeek) {
        send({
            type: "seek",
            seek: position
        } as SeekMessage);
    } else {
        send({
            type: "player",
            seek: position,
            track: trackInfo ?? null,
            paused: state == State.Paused,
            update: update ?? false
        } as PlayerMessage);
    }
}

/**
 * Connects to the gateway server asynchronously.
 */
async function connectAsync(): Promise<boolean> {
    const url = gatewayUrl();
    if (!url)
        throw new Error("No gateway set.");

    gateway = new WebSocket(url);
    return new Promise((resolve, reject) => {
        if (!gateway) return;

        gateway.onopen = () => resolve(true);
        gateway.onerror = () => reject(false);
    });
}

/**
 * Listener for when the gateway connection times out.
 */
function timeoutListener(): void {
    if (gateway) {
        gateway.readyState != WebSocket.CLOSED && gateway.close();
    }

    log.debug("Gateway connection timed out. Retrying...");
    handshake().catch(log.error);
}

/**
 * Establishes a repeated connection with the backend gateway.
 */
async function handshake(): Promise<void> {
    try {
        if (!await connectAsync()) {
            alert("Failed to connect to gateway. Retrying...");
            setTimeout(handshake, 5000);
            return;
        }

        if (!gateway) {
            alert("Gateway connection failed.");
            return;
        }

        log.debug("Connected to gateway!");

        gateway.onclose = () => setTimeout(timeoutListener, 5e3);
        gateway.onmessage = onGatewayMessage;

        // Send queued messages.
        messageQueue.forEach(send);
        messageQueue.length = 0;
    } catch (error) {
        alert(`Failed to connect to gateway: ${error}`);
    }
}

/**
 * Closes the gateway connection.
 */
function disconnect(): void {
    if (gateway) {
        gateway.onclose = null;
        gateway.close();
        gateway = undefined;
    }
}

/**
 * Sends a message to the gateway server.
 *
 * @param message The message to send.
 */
function send(message: BaseGatewayMessage): void {
    if (!gateway || gateway.readyState != WebSocket.OPEN) {
        messageQueue.push(message);
        return;
    }

    // Check if the message contains the proper fields.
    if (!message.type) throw new Error("Message type is required.");
    if (!message.timestamp) message.timestamp = Date.now();

    // Send the message to the gateway.
    gateway.send(JSON.stringify(message));
}

/**
 * Sends the message to initialize with the gateway.
 */
async function initialize(): Promise<void> {
    const settings = useSettings.getState();

    gateway?.send(JSON.stringify({
        type: "initialize",
        timestamp: Date.now(),
        token: await User.getToken(),
        broadcast: settings.system.broadcast_listening,
        presence: settings.system.presence
    } as InitializeMessage));

    log.debug("Initialized with the gateway.");
}

type Handler<T extends BaseGatewayMessage> = (message: T) => void;
const handlers: { [key: string]: Handler<any> } = {
    latency, sync, recents, synchronize
};

/**
 * Handles a gateway websocket message.
 *
 * @param event The message event.
 */
function onGatewayMessage(event: MessageEvent): void {
    let message: BaseGatewayMessage;
    try {
        message = JSON.parse(event.data);
    } catch (error) {
        log.error("Failed to parse gateway message:", error);
        return;
    }

    if (useDebug.getState().gatewayMessages) {
        log.debug("Received gateway message:", message);
    }

    try {
        // Handle the message data.
        const handler = handlers[message.type];
        handler && handler(message);
    } catch (error) {
        log.error("Failed to handle gateway message:", error);
    }
}

/**
 * Handles the 'latency' message.
 *
 * @param _ The message data.
 */
async function latency(_: LatencyMessage): Promise<void> {
    setTimeout(() => send({ type: "latency", timestamp: Date.now() }), 10e3);
}

/**
 * Handles the 'sync' message.
 *
 * @param message The message data.
 */
async function sync({ track, progress, paused, seek }: SyncMessage): Promise<void> {
    // Check if the track is valid.
    if (track == null && progress == -1) {
        // TODO: Stop listening along.
        return;
    }

    // Pass the message to the player.
    await Player.sync(track, progress, paused, seek);
}

/**
 * Handles the 'recents' message.
 *
 * @param message The message data.
 */
async function recents({ recents }: RecentsMessage): Promise<void> {
    useRecents.setState(recents
        .map(t => {
            t.type = "remote";
            return t;
        }), true);
}

/**
 * Handles the 'synchronize' message.
 *
 * @param _ The message data.
 */
async function synchronize(_: Synchronize): Promise<void> {
    // This message currently goes unhandled.
    // See description in:
    // https://trello.com/c/3Wmh80rC/5-feature-add-elixir-control-for-discord-connected-users
}

/**
 * Checks if the gateway is connected.
 */
function connected(): boolean {
    return gateway != null && gateway.readyState == WebSocket.OPEN;
}

export default {
    setup,
    disconnect,
    update,
    connected,
    socket: () => gateway
};

/// <editor-fold defaultstate="collapsed" desc="Types">
export type BaseGatewayMessage = {
    type: string;
    timestamp: number;
    message?: string;
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
    track: TrackInfo | null;
    seek: number; // Track progress.
    paused: boolean; // Is the player paused.
    update: boolean; // Should the presence be updated?
};

// To client.
export type SyncMessage = BaseGatewayMessage & {
    type: "sync";
    track: TrackInfo | null;
    progress: number;
    paused: boolean;
    seek: boolean;
};
// To client.
export type RecentsMessage = BaseGatewayMessage & {
    type: "recents";
    recents: RemoteInfo[];
};
/// </editor-fold>
