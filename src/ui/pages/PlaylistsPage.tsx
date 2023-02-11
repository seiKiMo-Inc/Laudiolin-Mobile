import React from "react";
import { ImageBackground, View, TouchableHighlight, ScrollView } from "react-native";

import { Icon } from "@rneui/base";

import BasicText from "@components/common/BasicText";
import LinearGradient from "react-native-linear-gradient";

import JumpInView from "@components/common/JumpInView";
import BasicButton from "@components/common/BasicButton";
import BasicModal from "@components/common/BasicModal";
import BasicInput from "@components/common/BasicInput";
import BasicCheckbox from "@components/common/BasicCheckbox";
import TextTicker from "react-native-text-ticker";

import { PlaylistMenuStyle } from "@styles/MenuStyle";
import { PlaylistsPageStyle } from "@styles/PageStyles";

import { getPlaylistAuthor, createPlaylist, login, deletePlaylist, loadPlaylists, userData } from "@backend/user";
import { importPlaylist, fetchAllPlaylists } from "@backend/playlist";
import { navigate } from "@backend/navigation";
import { Playlist, User } from "@backend/types";
import emitter from "@backend/events";

import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { playPlaylist } from "@backend/audio";
import FastImage from "react-native-fast-image";

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

    /**
     * Queues the playlist.
     */
    async queue(): Promise<void> {
        await playPlaylist(this.props.playlist, false);
    }

    /**
     * Deletes the playlist.
     */
    async delete(): Promise<void> {
        await deletePlaylist(this.props.playlist.id);
        this.props.onDelete();
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
                <TouchableHighlight
                    onPress={() => this.openPlaylist()}
                    style={{ borderRadius: 20 }}
                >
                    <LinearGradient
                        style={PlaylistsPageStyle.playlistContent}
                        colors={["transparent", "#0c0f17"]}
                        start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 0 }}
                    >
                        <ImageBackground
                            source={{ uri: playlist.icon }}
                            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: -1 }}
                            imageStyle={{ borderRadius: 20 }}
                            blurRadius={80}
                        />

                        <FastImage
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

                        <Menu style={{ position: "absolute", right: 0, top: 35 }}>
                            <MenuTrigger>
                                <Icon
                                    color={"white"}
                                    type="material" name={"more-vert"}
                                    containerStyle={PlaylistsPageStyle.playlistMore}
                                />
                            </MenuTrigger>

                            <MenuOptions customStyles={{ optionsContainer: PlaylistMenuStyle.menu }}>
                                <MenuOption customStyles={{ optionText: PlaylistMenuStyle.text }}
                                            text={"Add to Queue"} onSelect={() => this.queue()} />
                                <MenuOption customStyles={{ optionText: PlaylistMenuStyle.text }}
                                            text={"Delete Playlist"} onSelect={() => this.delete()} />
                            </MenuOptions>
                        </Menu>
                    </LinearGradient>
                </TouchableHighlight>
            </View>
        );
    }
}

interface IState {
    playlists: Playlist[];
    user: User|null;
    showCreatePlaylistModal: boolean;
    showImportPlaylistModal: boolean;
    playlistNameInputText: string;
    playlistDescriptionInputText: string;
    playlistIconUrlInputText: string;
    playlistIsPrivate: boolean;
    importPlaylistUrl: string;
}

interface IProps {
    showPage: boolean;
}

class PlaylistsPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            playlists: [],
            user: null,
            showCreatePlaylistModal: false,
            showImportPlaylistModal: false,
            playlistNameInputText: "",
            playlistDescriptionInputText: "",
            playlistIconUrlInputText: "",
            playlistIsPrivate: false,
            importPlaylistUrl: ""
        };
    }

    deletePlaylist = () => {
        this.setState({
            playlists: fetchAllPlaylists()
        });
    }

    createPlaylistAsync = async () => {
        const playlist: Playlist = {
            name: this.state.playlistNameInputText || "New Playlist",
            description: this.state.playlistDescriptionInputText || "No description",
            icon: this.state.playlistIconUrlInputText || "https://i.pinimg.com/564x/e2/26/98/e22698a130ad38d08d3b3d650c2cb4b3.jpg",
            isPrivate: this.state.playlistIsPrivate,
            tracks: [],
        }

        await createPlaylist(playlist);
        // Reload playlists.
        await login("", false);
        await loadPlaylists();

        this.setState({
            playlists: fetchAllPlaylists(),
            showCreatePlaylistModal: false,
            playlistNameInputText: "",
            playlistDescriptionInputText: "",
            playlistIconUrlInputText: "",
            playlistIsPrivate: false
        });
    }

    importPlaylistAsync = async () => {
        await importPlaylist(this.state.importPlaylistUrl);
        // Reload playlists.
        await login("", false);
        await loadPlaylists();

        this.setState({
            playlists: fetchAllPlaylists(),
            showImportPlaylistModal: false,
            importPlaylistUrl: ""
        });
    }

    componentDidMount() {
        this.setState({
            playlists: fetchAllPlaylists(),
            user: userData
        });
    }

    render() {
        return this.props.showPage ? (
            <JumpInView visible={this.props.showPage} style={PlaylistsPageStyle.container}>
                <View style={PlaylistsPageStyle.header}>
                    <Icon name={"chevron-left"} type={"material"} color={"white"} size={35} onPress={() => navigate("Home")} underlayColor={"#FFF"} />
                    <BasicText text={"Playlists"} style={{ fontSize: 25, fontWeight: "bold", marginLeft: 10 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        this.state.playlists.length > 0 ? (
                            this.state.playlists.map((playlist, index) => {
                                return (
                                    <ListPlaylist key={index} playlist={playlist} onDelete={() => this.deletePlaylist()} />
                                );
                            })
                        ) : (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <BasicText text={"No playlists found."} style={{ fontSize: 15, paddingBottom: 20 }} />
                            </View>
                        )
                    }

                    {
                        this.state.user != null ? (
                            <BasicButton
                                text={"Add Playlist"}
                                color={"#4e7abe"}
                                button={{ borderRadius: 10, width: 150, height: 40 }}
                                container={{
                                    alignItems: this.state.playlists.length > 0 ? "flex-end" : "center",
                                    paddingBottom: 20
                                }}
                                icon={<Icon
                                    color={"white"}
                                    type={"material"} name={"add"}
                                    style={{ paddingRight: 5 }}
                                />}
                                press={() => this.setState({ showCreatePlaylistModal: true })}
                            />
                        ) : (
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <BasicText text={"Sign in to create playlists."} style={{ fontSize: 15, paddingBottom: 20 }} />
                            </View>
                        )
                    }

                    <BasicModal
                        showModal={this.state.showCreatePlaylistModal}
                        onSubmit={this.createPlaylistAsync}
                        title={"Create Playlist"}
                        onBackdropPress={() => this.setState({ showCreatePlaylistModal: false })}
                    >
                        <BasicInput
                            placeholder={"Driving playlist..."}
                            onChangeText={(text) => this.setState({ playlistNameInputText: text })}
                            label={"Playlist Name"}
                        />
                        <BasicInput
                            placeholder={"The best songs for driving..."}
                            label={"Playlist Description"}
                            onChangeText={(text) => this.setState({ playlistDescriptionInputText: text })}
                            multiline={true}
                            numberOfLines={3}
                        />
                        <BasicInput
                            placeholder={"https://i.imgur.com/..."}
                            onChangeText={(text) => this.setState({ playlistIconUrlInputText: text })}
                            label={"Playlist Icon URL"}
                        />
                        <BasicCheckbox
                            checked={this.state.playlistIsPrivate}
                            onPress={() => this.setState({ playlistIsPrivate: !this.state.playlistIsPrivate })}
                            label={"Public Playlist"}
                        />
                        <BasicButton
                            text={"Or Import A Playlist"}
                            container={{ alignItems: "center", marginTop: 10 }}
                            press={() => this.setState({ showImportPlaylistModal: true, showCreatePlaylistModal: false })}
                            outline={"#5b67af"}
                        />
                    </BasicModal>

                    <BasicModal
                        showModal={this.state.showImportPlaylistModal}
                        onSubmit={this.importPlaylistAsync}
                        title={"Import Playlist"}
                        onBackdropPress={() => this.setState({ showImportPlaylistModal: false })}
                    >
                        <BasicText text={"You can import a playlist from Spotify or YouTube."} style={{ fontSize: 15 }} />
                        <BasicInput
                            placeholder={"https://open.spotify.com/playlist/..."}
                            label={"Playlist URL"}
                            onChangeText={(text) => this.setState({ importPlaylistUrl: text })}
                        />
                    </BasicModal>
                </ScrollView>
            </JumpInView>
        ) : null;
    }
}

export default PlaylistsPage;
