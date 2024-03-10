export type SearchEngine = "YouTube" | "Spotify" | "All";

export type TrackInfo = {
    id: string;
    title: string;
    artist: string;
    icon: string;
    url: string;
    duration: number;
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

export interface SearchResult {
    top: TrackInfo | null;
    results: TrackInfo[];
}

export const blank_SearchResult: SearchResult = {
    top: null,
    results: [],
};

export type BasicUser = {
    username?: string;
    userId?: string;
    avatar?: string;
    connections?: {
        google: boolean;
        discord: boolean;
    };
};

export type User = BasicUser & {
    playlists?: string[];
    likedSongs?: TrackInfo[];
    recentlyPlayed?: TrackInfo[];
};
