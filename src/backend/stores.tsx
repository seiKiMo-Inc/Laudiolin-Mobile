import { create } from "zustand";

export interface GlobalState {
    showTrackPage: boolean;

    showingAny: () => boolean;
    setShowTrackPage: (show: boolean) => void;
}

export const useGlobal = create<GlobalState>((set, get) => ({
    showTrackPage: false,

    showingAny: () => {
        const state = get();
        return state.showTrackPage;
    },
    setShowTrackPage: (show) => set({ showTrackPage: show })
}));
