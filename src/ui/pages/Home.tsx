import React from "react";
import { FlatList, ImageBackground, ScrollView, TouchableHighlight, View } from "react-native";

import Track from "@widgets/Track";
import BasicText from "@components/common/BasicText";
import List, { ListRenderItem } from "@components/common/List";
import LinearGradient from "react-native-linear-gradient";

import { HomePageStyle } from "@styles/PageStyles";

import { Playlist, TrackData } from "@backend/types";
import { favorites, makePlaylist, playlists, recents } from "@backend/user";

import * as fs from "@backend/fs";
import emitter from "@backend/events";
import { Gateway } from "@app/constants";
import { navigate } from "@backend/navigation";
import { playTrack } from "@backend/audio";

import { console } from "@app/utils";

/**
 * Gets the playlists for the user.
 * Adds the Favorites playlist if it exists.
 */
function getPlaylists(): Playlist[] {
    const lists = [...playlists];

    // Check if the user has favorites.
    if (favorites.length > 0) {
        // Add the favorites playlist.
        lists.unshift(makePlaylist(
            "favorites", "Favorites", `${Gateway.url}/Favorite.png`,
            "All your favorites!", favorites));
    }

    // Shorten the list to 6.
    if (lists.length > 6) lists.length = 6;

    return lists;
}

/**
 * Filters the tracks.
 * Removes duplicate entries.
 * @param tracks The tracks to filter.
 */
function filter(tracks: TrackData[]): TrackData[] {
    tracks
        // Remove duplicate tracks.
        .filter((track, index, self) => {
            if (track == null) return false;
            return self.findIndex(t => t.id == track.id) == index;
        });

    // Shorten the list to 6.
    if (tracks.length > 6) tracks.length = 6;

    return tracks;
}

class HomePlaylist extends React.PureComponent<any, any> {
    constructor(props: any) {
        super(props);
    }

    /**
     * Opens the playlist viewer.
     */
    openPlaylist(): void {
        emitter.emit("showPlaylist",
            this.props.playlist);
        navigate("Playlist");
    }

    render() {
        const playlist = this.props.playlist as Playlist;

        return (
            <View style={HomePageStyle.playlist}>
                <TouchableHighlight
                    style={{ borderRadius: 20 }}
                    underlayColor={"transparent"}
                    onPress={() => this.openPlaylist()}
                >
                    <ImageBackground
                        source={{ uri: playlist.icon }}
                        style={{ width: 136, height: 136 }}
                        imageStyle={HomePageStyle.playlistImage}
                    >
                        <BasicText
                            text={playlist.name}
                            style={HomePageStyle.playlistName}
                            containerStyle={HomePageStyle.playlistNameContainer}
                            numberOfLines={3}
                        />
                    </ImageBackground>
                </TouchableHighlight>
            </View>
        );
    }
}

interface IState {
    downloads: TrackData[];
    playlists: Playlist[];
}

class Home extends React.Component<any, IState> {
    /**
     * Force update listener.
     */
    update = () => this.forceUpdate();

    /**
     * Reloads all local tracks.
     */
    reloadLocal = async () => {
        // Load the downloads.
        await this.loadDownloads();
        // Update the component.
        this.forceUpdate();
    };

    constructor(props: any) {
        super(props);

        this.state = {
            downloads: [],
            playlists: []
        };
    }

    /**
     * Loads the downloaded tracks into the state.
     */
    async loadDownloads(): Promise<void> {
        const downloads = await fs.getDownloadedTracks();
        const tracks = [];
        for (const track of downloads.splice(0, 4))
            tracks.push(await fs.loadLocalTrackData(track));
        this.setState({ downloads: filter(tracks) });
    }

    componentDidMount() {
        this.setState({ playlists: getPlaylists() });

        emitter.on("login", this.update);
        emitter.on("recent", this.update);
        emitter.on("favorite", this.update);
        emitter.on("playlist", () => {
            this.setState({ playlists: getPlaylists() });
        });
        emitter.on("download", this.reloadLocal);
        emitter.on("delete", this.reloadLocal);

        // Load the downloads.
        this.loadDownloads()
            .catch(err => console.error(err));
    }

    componentWillUnmount() {
        emitter.removeListener("login", this.update);
        emitter.removeListener("recent", this.update);
        emitter.removeListener("delete", this.update);
        emitter.removeListener("favorite", this.update);
        emitter.removeListener("playlist", this.update);
        emitter.removeListener("download", this.update);
    }

    /**
     * Renders a home playlist.
     * @param info The info of the playlist.
     */
    renderPlaylist(info: ListRenderItem<Playlist>) {
        const { item, index } = info;
        if (item == null) return <></>;

        return (
            <HomePlaylist key={index} playlist={item} />
        );
    }

    /**
     * Renders a collection of tracks.
     * @param info The info of the track.
     * @param local Is the track a local track?
     */
    renderTracks(info: ListRenderItem<any>, local = false) {
        const { item, index } = info as ListRenderItem<TrackData>;
        if (item == null) return <></>;

        return (
            <Track
                key={index} track={item} local={local} padding={20}
                onClick={track => playTrack(track, true, true, local)}
            />
        );
    }

    greetingText = (): string => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning...";
        if (hour < 18) return "Good Afternoon...";
        return "Good Evening...";
    }

    render() {
        return (
            <ScrollView style={HomePageStyle.text} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={["#354ab2", "transparent"]}
                    style={{
                        position: "absolute",
                        top: 0,
                        height: 120,
                        zIndex: 0,
                        width: "100%",
                    }}
                />

                <BasicText
                    text={this.greetingText()}
                    style={{ fontSize: 20, color: "white", fontFamily: "System", fontWeight: "300" }}
                    containerStyle={{ width: "100%", padding: 40, paddingTop: 60, paddingLeft: 20 }}
                />

                <View style={{ paddingBottom: 20, width: "100%" }}>
                    <View style={HomePageStyle.header}>
                        <BasicText text={"Playlists"} style={HomePageStyle.headerText} />
                        <BasicText text={"More"} style={HomePageStyle.morePlaylists}
                                   press={() => navigate("Playlists")}
                        />
                    </View>

                    {
                        this.state.playlists.length > 0 ?
                            (<FlatList
                                style={HomePageStyle.playlists}
                                data={this.state.playlists.slice(0, 6)}
                                renderItem={(info) => this.renderPlaylist(info)}
                                horizontal showsHorizontalScrollIndicator={false}
                            />) :
                            (<BasicText text={"No playlists yet."} style={{ textAlign: "center", justifyContent: "center", padding: 40 }}  />)
                    }
                </View>

                {
                    this.state.downloads.length > 0 ? (
                        <View style={{ paddingBottom: 20 }}>
                            <View style={HomePageStyle.header}>
                                <BasicText text={"Downloads"} style={HomePageStyle.headerText} />
                                <BasicText text={"More"} style={HomePageStyle.moreDownloads}
                                           press={() => navigate("Downloads")}
                                />
                            </View>

                            <List
                                style={HomePageStyle.tracks}
                                data={this.state.downloads}
                                renderItem={(info) => this.renderTracks(info, true)}
                            />
                        </View>
                    ) : null
                }

                {
                    recents.length > 0 ? (
                        <View style={{ paddingBottom: 20 }}>
                            <View style={HomePageStyle.header}>
                                <BasicText text={"Recent Plays"} style={HomePageStyle.headerText} />
                            </View>

                            <List
                                style={HomePageStyle.tracks}
                                data={filter(recents)}
                                renderItem={(info) => this.renderTracks(info)}
                            />
                        </View>
                    ) : null
                }
            </ScrollView>
        );
    }
}

export default Home;
