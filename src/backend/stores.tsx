import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { User, SearchEngine, DownloadInfo, RemoteInfo, OwnedPlaylist } from "@backend/types";

export interface GlobalState {
    showTrackPage: boolean;
    showLoginPage: boolean;
    fromPlaylist: string | null;
    loadTries: number;

    showingAny: () => boolean;
    setShowTrackPage: (show: boolean) => void;
    setShowLoginPage: (show: boolean) => void;
    incrementTries: () => void;
}
export const useGlobal = create<GlobalState>((set, get) => ({
    showTrackPage: false,
    showLoginPage: false,
    fromPlaylist: null,
    loadTries: 0,

    showingAny: () => {
        const state = get();
        return state.showTrackPage || state.showLoginPage;
    },
    setShowTrackPage: (show) => set({ showTrackPage: show }),
    setShowLoginPage: (show) => set({ showLoginPage: show }),
    incrementTries: () => set((state) => ({ loadTries: state.loadTries + 1 }))
}));

export interface DebugState {
    playbackState: boolean;
    trackInfo: boolean;
    gatewayMessages: boolean;

    update(object: any): void;
}
export const useDebug = create<DebugState>((set) => ({
    playbackState: false,
    trackInfo: false,
    gatewayMessages: false,

    update: (object: any) => set(object)
}));

export interface SettingsState {
    show_login: boolean;

    search: {
        engine: SearchEngine
    };
    ui: {
        color_theme: "Light" | "Dark" | "System";
        show_queue: boolean;
    };
    system: {
        broadcast_listening: "Nobody" | "Friends" | "Everyone";
        presence: "Generic" | "Simple" | "Detailed" | "None";
        server: string | null; // http(s)://<ip>:<port>
        gateway: string | null; // ws(s)://<ip>:<port>
    };

    update(key: string, value: any): void;
    get(key: string): any;
}
export const useSettings = create<SettingsState>()(persist(
    (set, get): SettingsState => ({
        show_login: true,
        search: {
            engine: "All"
        },
        ui: {
            color_theme: "System",
            show_queue: true
        },
        system: {
            broadcast_listening: "Nobody",
            presence: "None",
            server: "https://demo.laudiol.in",
            gateway: "wss://demo.laudiol.in"
        },

        update: (name, value) => set((state) => {
            let obj: any;
            if (name.includes(".")) {
                // Get the correct object.
                const parts = name.split(".");
                const key = parts.pop() as string;
                obj = parts.reduce((a: any, b) => a[b], state);

                // Set the value.
                if (obj) {
                    obj[key] = value;
                }
            } else {
                obj = state;
                if (name in obj) {
                    obj[name] = value;
                }
            }

            return obj;
        }),
        get: (name) => {
            let object: any = get();
            const parts = name.split(".");
            for (const part of parts) {
                object = object[part];
            }
            return object;
        }
    }),
    {
        version: 4,
        name: "settings",
        storage: createJSONStorage(() => AsyncStorage),
        migrate: (lastState, lastVersion) => {
            const state = {};
            Object.assign(state, lastState);

            if (lastVersion == 2) {
                (state as SettingsState).ui.show_queue = false;
            }
            if (lastVersion == 3) {
                (state as SettingsState).show_login = false;
            }

            return state;
        }
    }
));

export type Colors = {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
    contrast: string;
    red: string;
    gray: string;
}
type ColorState = Colors & {
    change(colors: Colors): void;
};
export const useColor = create<ColorState>()(persist(
    (set): ColorState => ({
        primary: "#0c0f17",
        secondary: "#1b273a",
        text: "#ffffff",
        accent: "#4e7abe",
        contrast: "#6d90ca",
        red: "#d21d4f",
        gray: "#888787",
        change: (colors) => set(colors)
    }),
    {
        version: 1,
        name: "palette",
        storage: createJSONStorage(() => AsyncStorage)
    }
));

interface DownloadState {
    downloaded: DownloadInfo[];

    add: (info: DownloadInfo) => void;
    remove: (id: string) => void;
    isLocal: (id: string) => boolean;
}
export const useDownloads = create<DownloadState>()(persist(
    (set, get): DownloadState => ({
        downloaded: [],

        add: (info) => {
            set((state) => ({
                downloaded: [...state.downloaded, info]
            }));
        },
        remove: (id) => {
            set((state) => ({
                downloaded: state.downloaded.filter((info) => info.id !== id)
            }));
        },
        isLocal: (id) => {
            const state = get();
            return state.downloaded.some((info) => info.id === id);
        }
    }),
    {
        name: "downloads",
        version: 1,
        storage: createJSONStorage(() => AsyncStorage),
        migrate: (oldState, _) => {
            return oldState;
        }
    }
));

export const useUser = create<User | null>(() => null);

export const useRecents = create<RemoteInfo[]>()(persist(
    (): RemoteInfo[] => [],
    {
        name: "recents",
        version: 1,
        storage: createJSONStorage(() => AsyncStorage),
        migrate: (oldState, _) => {
            return oldState;
        }
    }
));
export const useFavorites = create<RemoteInfo[]>()(persist(
    (): RemoteInfo[] => [],
    {
        name: "recents",
        version: 1,
        storage: createJSONStorage(() => AsyncStorage),
        migrate: (oldState, _) => {
            return oldState;
        }
    }
));

export const usePlaylists = create<OwnedPlaylist[]>(() => []);
