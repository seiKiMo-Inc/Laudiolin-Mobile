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

export interface SearchResult {
    top: TrackInfo | null;
    results: TrackInfo[];
}

export const blank_SearchResult: SearchResult = {
    top: null,
    results: [],
};
