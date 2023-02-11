export type Page = "Home" | "Search" | "Login" | "Playing" | "Playlist" | "Playlists" | "Profile" | "Downloads";

export type SearchEngine = "YouTube" | "Spotify" | "All";
export type TrackData = {
    title: string;
    artist: string;
    icon: string;
    url: string;
    id: string;
    duration: number;
};
export type SearchResults = {
    top: SearchResult;
    results: SearchResult[];
};
export type SearchOptions = {
    engine: string;
    accuracy: boolean;
};

export type SearchResult = TrackData;
export type Playlist = {
    owner?: string;
    id?: string;

    name: string;
    description: string;
    icon: string;
    isPrivate: boolean;
    tracks: TrackData[];
};

export type BasicUser = {
    username?: string;
    discriminator?: string;
    userId?: string;
    avatar?: string;
};
export type OnlineUser = BasicUser & {
    listeningTo?: TrackData;
    progress?: number;
};
export type User = BasicUser & {
    playlists?: string[];
    likedSongs?: TrackData[];
    recentlyPlayed?: TrackData[];
};

export type UserSettings = {
    search: SearchSettings;
    audio: AudioSettings;
    ui: UISettings;
    token: string;
};
export type SearchSettings = {
    accuracy: boolean;
    engine: SearchEngine;
};
export type AudioSettings = {

};
export type UISettings = {
    background_color: string;
    background_url: string;
};
export type SettingType = "boolean" | "input" | "select" | "color";

export type InAppNotificationData = {
    message: string;
    date: Date;
    icon: string;
    onPress?: () => void;
};

export type PlaylistSelectInfo = {
    title: string;
    callback: (playlist?: Playlist) => void;
};
