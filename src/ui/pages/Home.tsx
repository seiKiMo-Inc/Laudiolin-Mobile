import React from "react";
import { FlatList, ListRenderItemInfo, ScrollView, View } from "react-native";

import Track from "@components/Track";
import BasicText from "@components/common/BasicText";

import { Image } from "@rneui/base";

import { HomePageStyle } from "@styles/PageStyles";

import { Playlist } from "@backend/types";
import { playlists } from "@backend/user";

import emitter from "@backend/events";
import { navigate } from "@backend/navigation";

const testTrack = {
    title: "Hikaru Nara (Your Lie In April)",
    artist: "Otaku",
    icon: "https://i.scdn.co/image/ab67616d0000b273cbd6575a821e3a9bee15fc93",
    url: "https://open.spotify.com/track/1eznJLhlnbXrXuO8Ykkhhg",
    id: "FRR642100241",
    duration: 117
};

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
                <Image
                    source={{ uri: playlist.icon }}
                    style={HomePageStyle.playlistImage}
                    onPress={() => this.openPlaylist()}
                />
            </View>
        );
    }
}

class Home extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    /**
     * Renders a home playlist.
     * @param info The info of the playlist.
     */
    renderPlaylist(info: ListRenderItemInfo<Playlist>) {
        const { item, index } = info;

        return (
            <HomePlaylist key={index} playlist={item} />
        );
    }

    render() {
        return (
            <ScrollView contentContainerStyle={HomePageStyle.text}>
                <View style={{ paddingBottom: 20 }}>
                    <View style={{ flexDirection: "row" }}>
                        <BasicText text={"Playlists"} style={HomePageStyle.header} />
                        <View style={{ justifyContent: "center" }}>
                            <BasicText text={"More"} style={HomePageStyle.morePlaylists} />
                        </View>
                    </View>

                    <FlatList
                        style={HomePageStyle.playlists}
                        data={playlists}
                        renderItem={(info) => this.renderPlaylist(info)}
                        horizontal showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View style={{ paddingBottom: 20 }}>
                    <View style={{ flexDirection: "row" }}>
                        <BasicText text={"Downloads"} style={HomePageStyle.header} />
                        <View style={{ justifyContent: "center" }}>
                            <BasicText text={"More"} style={HomePageStyle.moreDownloads} />
                        </View>
                    </View>

                    <View>
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                    </View>
                </View>

                <View>
                    <View style={{ flexDirection: "row" }}>
                        <BasicText text={"Recent Plays"} style={HomePageStyle.header} />
                        <View style={{ justifyContent: "center" }}>
                            <BasicText text={"More"} style={HomePageStyle.morePlays} />
                        </View>
                    </View>

                    <View>
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default Home;
