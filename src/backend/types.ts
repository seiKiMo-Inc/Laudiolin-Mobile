export type SearchEngine = "youtube" | "spotify" | "all";

export type TrackInfo = {
    id: string;
    title: string;
    artist: string;
    icon: string;
    url: string;
    duration: number;
};

export const blank_TrackInfo: TrackInfo = {
    id: "",
    title: "",
    artist: "",
    icon: "",
    url: "",
    duration: 0,
};

export type PlaylistInfo = {
    id: string;
    author: string;
    name: string;
    description: string;
    icon: string;
    isPrivate: boolean;
    tracks: TrackInfo[];
};

export const blank_PlaylistInfo: PlaylistInfo = {
    id: "",
    author: "",
    name: "",
    description: "",
    icon: "",
    isPrivate: true,
    tracks: [],
};

export interface SearchResult {
    top: TrackInfo | null;
    results: TrackInfo[];
}

export const blank_SearchResult: SearchResult = {
    top: null,
    results: [],
};
