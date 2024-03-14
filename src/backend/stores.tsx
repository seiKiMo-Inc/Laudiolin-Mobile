import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { User, SearchEngine, PlaylistInfo, DownloadInfo, RemoteInfo } from "@backend/types";

export interface GlobalState {
    showTrackPage: boolean;
    showLoginPage: boolean;
    fromPlaylist: string | null;

    showingAny: () => boolean;
    setShowTrackPage: (show: boolean) => void;
    setShowLoginPage: (show: boolean) => void;
}
export const useGlobal = create<GlobalState>((set, get) => ({
    showTrackPage: false,
    showLoginPage: false,
    fromPlaylist: null,

    showingAny: () => {
        const state = get();
        return state.showTrackPage || state.showLoginPage;
    },
    setShowTrackPage: (show) => set({ showTrackPage: show }),
    setShowLoginPage: (show) => set({ showLoginPage: show })
}));

export interface DebugState {
    playbackState: boolean;

    update(object: any): void;
}
export const useDebug = create<DebugState>((set) => ({
    playbackState: false,

    update: (object: any) => set(object)
}));

export interface SettingsState {
    search: {
        accuracy: boolean,
        engine: SearchEngine
    };
    ui: {
        color_theme: "Light" | "Dark";
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
        search: {
            accuracy: true,
            engine: "All"
        },
        ui: {
            color_theme: "Dark"
        },
        system: {
            broadcast_listening: "Nobody",
            presence: "None",
            server: "https://demo.laudiol.in",
            gateway: "wss://demo.laudiol.in"
        },

        update: (name, value) => set((state) => {
            // Get the correct object.
            const parts = name.split(".");
            const key = parts.pop() as string;
            const obj = parts.reduce((a: any, b) => a[b], state);

            // Set the value.
            if (obj) {
                obj[key] = value;
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
        version: 1,
        name: "settings",
        storage: createJSONStorage(() => AsyncStorage)
    }
));

export const useUser = create<User | null>(() => null);
export const useRecents = create<RemoteInfo[]>(() => []);
export const useFavorites = create<RemoteInfo[]>(() => []);
export const usePlaylists = create<PlaylistInfo[]>(() => []);
export const useDownloads = create<DownloadInfo[]>(() => []);
