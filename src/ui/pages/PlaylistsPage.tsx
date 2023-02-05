import React from "react";
import { FlatList, ImageBackground, ListRenderItemInfo, View, TouchableHighlight } from "react-native";

import { Icon, Image } from "@rneui/base";

import BasicText from "@components/common/BasicText";
import LinearGradient from "react-native-linear-gradient";

import { PlaylistsPageStyle } from "@styles/PageStyles";
import JumpInView from "@components/common/JumpInView";
import BasicButton from "@components/common/BasicButton";
import TextTicker from "react-native-text-ticker";

import { getPlaylistAuthor, playlists } from "@backend/user";
import { navigate } from "@backend/navigation";
import { Playlist } from "@backend/types";
import emitter from "@backend/events";

class ListPlaylist extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            author: (props.playlist as Playlist).owner
        };
    }

    /**
     * Opens the playlist viewer.
     */
    openPlaylist(): void {
        emitter.emit("showPlaylist",
            this.props.playlist);
        navigate("Playlist");
    }

    async componentDidMount() {
        this.setState({
            author: await getPlaylistAuthor(this.props.playlist)
        });
    }

    render() {
        const playlist = this.props.playlist as Playlist;

        return (
            <View style={PlaylistsPageStyle.playlist}>
                <TouchableHighlight onPress={() => this.openPlaylist()}>
                    <LinearGradient
                        style={PlaylistsPageStyle.playlistContent}
                        colors={["transparent", "#0c0f17"]}
                        start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 0 }}
                    >
                        <ImageBackground
                            source={{ uri: playlist.icon }}
                            style={{ width: "99%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: -1 }}
                            imageStyle={{ borderRadius: 20 }}
                            blurRadius={80}
                        />

                        <Image
                            source={{ uri: playlist.icon }}
                            style={PlaylistsPageStyle.playlistImage}
                        />

                        <View style={{ paddingLeft: 20, justifyContent: "center" }}>
                            <TextTicker
                                style={PlaylistsPageStyle.playlistTitle}
                                loop duration={5000}
                            >
                                {playlist.name}
                            </TextTicker>

                            <BasicText
                                text={this.state.author}
                                style={PlaylistsPageStyle.playlistAuthor}
                                numberOfLines={1}
                            />
                        </View>

                        <Icon
                            color={"white"}
                            type="material" name={"more-vert"}
                            containerStyle={PlaylistsPageStyle.playlistMore}
                        />
                    </LinearGradient>
                </TouchableHighlight>
            </View>
        );
    }
}

interface IProps {
    showPage: boolean;
}

class PlaylistsPage extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    renderPlaylist(info: ListRenderItemInfo<Playlist>) {
        const { item, index } = info;

        return (
            <ListPlaylist key={index} playlist={item} />
        );
    }

    render() {
        return this.props.showPage ? (
            <JumpInView visible={this.props.showPage} style={PlaylistsPageStyle.container}>
                <View style={PlaylistsPageStyle.header}>
                    <Icon name={"chevron-left"} type={"material"} color={"white"} size={35} onPress={() => navigate("Home")} underlayColor={"#FFF"} />
                    <BasicText text={"Playlists"} style={{ fontSize: 25, fontWeight: "bold", marginLeft: 10 }} />
                </View>

                <View>
                    <FlatList
                        data={playlists}
                        renderItem={(info) => this.renderPlaylist(info)}
                        showsVerticalScrollIndicator={false}
                    />

                    <BasicButton
                        text={"Add Playlist"}
                        color={"#4e7abe"}
                        button={{ borderRadius: 10, width: 150, height: 40 }}
                        container={{ alignItems: "flex-end" }}
                        icon={<Icon
                            color={"white"}
                            type={"material"} name={"add"}
                            style={{ paddingRight: 5 }}
                        />}
                    />
                </View>
            </JumpInView>
        ) : null;
    }
}

export default PlaylistsPage;
