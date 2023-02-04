import React from "react";
import { FlatList, ImageBackground, ListRenderItemInfo, TouchableHighlight, View } from "react-native";

import Track from "@components/Track";
import BasicText from "@components/common/BasicText";

import { HomePageStyle } from "@styles/PageStyles";

import { Playlist, TrackData } from "@backend/types";
import { favorites, makePlaylist, playlists, recents } from "@backend/user";

import emitter from "@backend/events";
import { Gateway } from "@app/constants";
import { navigate } from "@backend/navigation";

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

class HomePlaylist extends React.Component<any, any> {
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

class Home extends React.Component<any, any> {
    /**
     * Force update listener.
     */
    update = () => this.forceUpdate();

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            // Update the component.
            this.forceUpdate();
        }, 1000);

        emitter.on("login", this.update);
        emitter.on("recent", this.update);
        emitter.on("favorite", this.update);
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
    renderPlaylist(info: ListRenderItemInfo<Playlist>) {
        const { item, index } = info;
        if (item == null) return <></>;

        return (
            <HomePlaylist key={index} playlist={item} />
        );
    }

    /**
     * Renders a favorite track.
     * @param info The info of the track.
     */
    renderFavorite(info: ListRenderItemInfo<TrackData>) {
        const { item, index } = info;
        if (item == null) return <></>;

        return (
            <Track key={index} track={item} padding={20} />
        );
    }

    render() {
        return (
            <View style={HomePageStyle.text}>
                <View style={{ paddingBottom: 20 }}>
                    <View style={HomePageStyle.header}>
                        <BasicText text={"Playlists"} style={HomePageStyle.headerText} />
                        <BasicText text={"More"} style={HomePageStyle.morePlaylists} press={() => navigate("Playlists")} />
                    </View>

                    <FlatList
                        style={HomePageStyle.playlists}
                        data={getPlaylists()}
                        renderItem={(info) => this.renderPlaylist(info)}
                        horizontal showsHorizontalScrollIndicator={false}
                    />
                </View>

                {/* <View style={{ paddingBottom: 20 }}>
                    <View style={HomePageStyle.header}>
                        <BasicText text={"Downloads"} style={HomePageStyle.headerText} />
                        <BasicText text={"More"} style={HomePageStyle.moreDownloads} />
                    </View>

                    <View>
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                    </View>
                </View> */}

                <View>
                    <View style={HomePageStyle.header}>
                        <BasicText text={"Recent Plays"} style={HomePageStyle.headerText} />
                        <BasicText text={"More"} style={HomePageStyle.moreDownloads} />
                    </View>

                    <FlatList
                        data={filter(recents)}
                        renderItem={(info) => this.renderFavorite(info)}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        );
    }
}

export default Home;
