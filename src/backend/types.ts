export type SearchEngine = "YouTube" | "Spotify" | "All";

export type TrackInfo = RemoteInfo | DownloadInfo;

type TrackData = {
    id: string;
    title: string;
    artist: string;
    icon: string;
    url: string;
    duration: number;
};

export type RemoteInfo = TrackData & {
    type: "remote";
};

export type DownloadInfo = TrackData & {
    type: "download";
    encoded: boolean;
};

export type PlaylistInfo = OwnedPlaylist | PlaylistData;

export type PlaylistData = {
    name: string;
    description: string;
    icon: string;
    isPrivate: boolean;
    tracks: TrackInfo[];
};

export type OwnedPlaylist = PlaylistData & {
    type: "info";
    id: string;
    owner: string;
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
    likedSongs?: RemoteInfo[];
    recentlyPlayed?: RemoteInfo[];
};
