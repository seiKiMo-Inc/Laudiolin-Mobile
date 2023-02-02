export type Page = "Home" | "Search" | "Login" | "Playing" | "Playlist" | "Profile";

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

export type User = {
    playlists?: string[];
    likedSongs?: string[];

    username?: string;
    discriminator?: string;
    userId?: string;
    avatar?: string;
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
