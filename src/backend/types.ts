import { BaseGatewayMessage } from "@backend/gateway";

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
    filePath: string;
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
    top: RemoteInfo | null;
    results: RemoteInfo[];
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
    isDeveloper?: boolean;
    playlists?: string[];
    likedSongs?: RemoteInfo[];
    recentlyPlayed?: RemoteInfo[];
};

/**
 * If something is undefined, it should be ignored.
 * If something is null, the default value or a reset should be used.
 */
export type Synchronize = BaseGatewayMessage & {
    doAll: boolean | null | undefined;
    playingTrack: TrackData | null | undefined;
    paused: boolean | null | undefined;
    volume: number | null | undefined;
    queue: TrackData[] | null | undefined;
    loopMode: number | null | undefined;
    position: number | null | undefined;
    shuffle: boolean | null | undefined;
};
