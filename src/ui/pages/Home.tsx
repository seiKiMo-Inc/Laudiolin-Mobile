import React from "react";
import { FlatList, ImageBackground, ScrollView, TouchableHighlight, View } from "react-native";

import Track from "@components/Track";
import BasicText from "@components/common/BasicText";
import List, { ListRenderItem } from "@components/common/List";

import { HomePageStyle } from "@styles/PageStyles";

import { Playlist, TrackData } from "@backend/types";
import { favorites, makePlaylist, playlists, recents } from "@backend/user";

import * as fs from "@backend/fs";
import emitter from "@backend/events";
import { Gateway } from "@app/constants";
import { navigate } from "@backend/navigation";
import { playTrack } from "@backend/audio";

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

    return lists;
}

/**
 * Filters the tracks.
 * Removes duplicate entries.
 * @param tracks The tracks to filter.
 */
function filter(tracks: TrackData[]): TrackData[] {
    return tracks
        // Remove duplicate tracks.
        .filter((track, index, self) => {
            if (track == null) return false;
            return self.findIndex(t => t.id == track.id) == index;
        });
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
}

class Home extends React.Component<any, IState> {
    /**
     * Force update listener.
     */
    update = () => this.forceUpdate();

    constructor(props: any) {
        super(props);

        this.state = {
            downloads: []
        };
    }

    async componentDidMount() {
        setTimeout(() => {
            // Update the component.
            this.forceUpdate();
        }, 1000);

        emitter.on("login", this.update);
        emitter.on("recent", this.update);
        emitter.on("favorite", this.update);

        // Load the downloads.
        const downloads = await fs.getDownloadedTracks();
        const tracks = [];
        for (const track of downloads.splice(0, 4))
            tracks.push(await fs.loadLocalTrackData(track));
        this.setState({ downloads: filter(tracks) });
    }

    componentWillUnmount() {
        emitter.removeListener("login", this.update);
        emitter.removeListener("recent", this.update);
        emitter.removeListener("favorite", this.update);
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
     */
    renderTracks(info: ListRenderItem<any>) {
        const { item, index } = info as ListRenderItem<TrackData>;
        if (item == null) return <></>;

        return (
            <Track
                key={index} track={item} padding={20}
                onClick={track => playTrack(track, true, true)}
            />
        );
    }

    render() {
        return (
            <ScrollView style={HomePageStyle.text}>
                <View style={{ paddingBottom: 20 }}>
                    <View style={HomePageStyle.header}>
                        <BasicText text={"Playlists"} style={HomePageStyle.headerText} />
                        <BasicText text={"More"} style={HomePageStyle.morePlaylists}
                                   press={() => navigate("Playlists")}
                        />
                    </View>

                    <FlatList
                        style={HomePageStyle.playlists}
                        data={getPlaylists()}
                        renderItem={(info) => this.renderPlaylist(info)}
                        horizontal showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View style={{ paddingBottom: 20 }}>
                    <View style={HomePageStyle.header}>
                        <BasicText text={"Downloads"} style={HomePageStyle.headerText} />
                        <BasicText text={"More"} style={HomePageStyle.moreDownloads}
                                      press={() => navigate("Downloads")}
                        />
                    </View>

                    {
                        this.state.downloads.length > 0 ?
                        (<List
                            data={this.state.downloads}
                            renderItem={(info) => this.renderTracks(info)}
                        />) :
                        (<BasicText text={"No downloads yet."} style={{ textAlign: "center", justifyContent: "center", padding: 40 }}  />)
                    }
                </View>

                <View style={{ paddingBottom: 20 }}>
                    <View style={HomePageStyle.header}>
                        <BasicText text={"Recent Plays"} style={HomePageStyle.headerText} />
                    </View>

                    {
                        recents.length > 0 ?
                        (<List
                            data={filter(recents)}
                            renderItem={(info) => this.renderTracks(info)}
                        />) :
                        (<BasicText text={"No recent plays."} style={{ textAlign: "center", justifyContent: "center", padding: 40 }}  />)
                    }
                </View>
            </ScrollView>
        );
    }
}

export default Home;
