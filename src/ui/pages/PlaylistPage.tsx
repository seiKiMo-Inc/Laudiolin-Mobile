import React from "react";
import { FlatList, View, ListRenderItemInfo, ScrollView, TouchableHighlight } from "react-native";

import { Icon, ScreenWidth } from "@rneui/base";

import Track from "@widgets/Track";
import Hide from "@components/common/Hide";
import BasicText from "@components/common/BasicText";
import JumpInView from "@components/common/JumpInView";
import BasicInput from "@components/common/BasicInput";
import BasicModal from "@components/common/BasicModal";
import BasicButton from "@components/common/BasicButton";
import BasicCheckbox from "@components/common/BasicCheckbox";
import FastImage from "react-native-fast-image";

import { PlaylistPageStyle } from "@styles/PageStyles";

import type { Playlist, TrackData } from "@backend/types";
import { downloadTrack, playPlaylist, playTrack } from "@backend/audio";
import { dismiss, notify } from "@backend/notifications";
import { getPlaylistAuthor } from "@backend/user";
import { editPlaylist } from "@backend/playlist";
import { navigate } from "@backend/navigation";
import emitter from "@backend/events";

import { console } from "@app/utils";

interface IProps {
    showPage: boolean;
}

interface IState {
    playlist: Playlist|null;
    author: string;
    showEditPlaylistModal: boolean;
    playlistEditName: string;
    playlistEditDescription: string;
    playlistEditIcon: string;
    playlistEditIsPrivate: boolean;
}

class PlaylistPage extends React.Component<IProps, IState> {
    onPlaylist = async (playlist: Playlist) => {
        this.setState({
            playlist, author: await getPlaylistAuthor(playlist),
            playlistEditName: playlist.name,
            playlistEditDescription: playlist.description,
            playlistEditIcon: playlist.icon,
            playlistEditIsPrivate: playlist.isPrivate,
        });
    };

    constructor(props: IProps) {
        super(props);

        this.state = {
            playlist: null,
            author: "",
            showEditPlaylistModal: false,
            playlistEditName: "",
            playlistEditDescription: "",
            playlistEditIcon: "",
            playlistEditIsPrivate: false,
        };
    }

    componentDidMount() {
        emitter.on("reloadPlaylist", this.onPlaylist);
        emitter.on("showPlaylist", this.onPlaylist);
    }

    componentWillUnmount() {
        emitter.removeListener("reloadPlaylist", this.onPlaylist);
        emitter.removeListener("showPlaylist", this.onPlaylist);
    }

    /**
     * Renders a playlist track.
     * @param item The track data.
     */
    renderPlaylist(item: ListRenderItemInfo<TrackData>) {
        return (
            <Track
                key={item.index} padding={20}
                track={item.item} playlist={this.state.playlist!}
                onClick={track => playTrack(track, true, true)}
            />
        );
    }

    /**
     * Returns the tracks in the playlist.
     */
    getPlaylistTracks(): TrackData[] {
        if (this.state.playlist == null)
            return [];

        return this.state.playlist.tracks
            // Remove duplicate tracks.
            .filter((track, index, self) => {
                return self.findIndex(t => t.id == track.id) == index;
            });
    }

    /**
     * Plays the tracks in the playlist.
     * @param shuffle Whether to shuffle the tracks.
     */
    async playTracks(shuffle: boolean): Promise<void> {
        await playPlaylist(this.state.playlist!, shuffle);
    }

    /**
     * Downloads the playlist's tracks.
     */
    downloadPlaylist(): void {
        // Download each track.
        this.getPlaylistTracks().forEach(track =>
            downloadTrack(track, false));

        // Send a notification.
        notify({
            type: "info",
            message: `Started download of playlist ${this.state.playlist?.name ?? "Unknown"}.`,
            date: new Date(),
            icon: "file-download",
            onPress: dismiss
        }).catch(err => console.error(err));
    }

    /**
     * Edits the playlist.
     */
    editPlaylistAsync = async (): Promise<void> => {
        const playlist: Playlist = {
            name: this.state.playlistEditName,
            description: this.state.playlistEditDescription,
            icon: this.state.playlistEditIcon,
            isPrivate: this.state.playlistEditIsPrivate,
            tracks: this.state.playlist?.tracks ?? [],
        }

        await editPlaylist(playlist);
        this.setState({ playlist, showEditPlaylistModal: false });
    }

    render() {
        // Check for a valid playlist.
        const { playlist } = this.state;

        return this.props.showPage ? (
            <JumpInView visible={this.props.showPage} style={PlaylistPageStyle.container}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Icon
                        name={"chevron-left"}
                        type={"material"} size={30}
                        color={"white"} onPress={() => navigate("Home")}
                        underlayColor={"white"}
                    />

                    <Hide show={playlist != null}>
                        <BasicText
                            text={`Author: ${this.state.author}`}
                            style={{ fontWeight: "bold", fontSize: 15 }}
                            containerStyle={{ marginLeft: 20 }}
                        />
                    </Hide>
                </View>

                <Hide show={playlist != null}>
                    <View style={PlaylistPageStyle.info}>
                        <TouchableHighlight
                            style={PlaylistPageStyle.playlistIcon}
                            onLongPress={() => this.downloadPlaylist()}
                        >
                            <FastImage
                                source={{ uri: playlist?.icon }}
                                style={PlaylistPageStyle.playlistIcon}
                            />
                        </TouchableHighlight>

                        <View style={PlaylistPageStyle.text}>
                            <BasicText
                                text={playlist?.name ?? ""}
                                style={PlaylistPageStyle.playlistName}
                            />
                            <BasicText
                                text={playlist?.description ?? ""}
                                style={PlaylistPageStyle.playlistAuthor}
                            />
                        </View>
                    </View>

                    <View style={PlaylistPageStyle.actions}>
                        <BasicButton
                            right={20}
                            text={"Edit"}
                            color={"#1b273a"}
                            title={PlaylistPageStyle.editText}
                            button={PlaylistPageStyle.editButton}
                            icon={<Icon
                                color={"white"}
                                type={"material"} name={"edit"}
                                style={{ paddingRight: 10 }}
                            />}
                            press={() => this.setState({ showEditPlaylistModal: true })}
                        />

                        <BasicButton
                            right={20}
                            text={"Play"}
                            color={"#59ac8f"}
                            title={PlaylistPageStyle.playText}
                            button={PlaylistPageStyle.playButton}
                            container={{ position: "absolute", right: 130 }}
                            icon={<Icon
                                color={"white"}
                                type={"material"} name={"play-arrow"}
                                style={{ paddingRight: 5 }}
                            />}
                            press={() => this.playTracks(false)}
                        />

                        <BasicButton
                            text={"Shuffle"}
                            color={"#4e7abe"}
                            title={PlaylistPageStyle.shuffleText}
                            button={PlaylistPageStyle.shuffleButton}
                            container={{ position: "absolute", right: 40 }}
                            icon={<Icon
                                color={"white"}
                                type={"material"} name={"shuffle"}
                                style={{ paddingRight: 5 }}
                            />}
                            press={() => this.playTracks(true)}
                        />
                    </View>

                    <FlatList
                        style={PlaylistPageStyle.tracks}
                        data={this.getPlaylistTracks()}
                        renderItem={item => this.renderPlaylist(item)}
                        showsHorizontalScrollIndicator={false}
                    />
                </Hide>
                <BasicModal
                    showModal={this.state.showEditPlaylistModal}
                    onSubmit={this.editPlaylistAsync}
                    title={"Edit Playlist"}
                    onBackdropPress={() => this.setState({ showEditPlaylistModal: false })}
                >
                    <ScrollView showsVerticalScrollIndicator={false} style={{width: ScreenWidth, maxWidth: "100%"}}>
                    <BasicInput
                        text={this.state.playlistEditName}
                        placeholder={"Driving playlist..."}
                        onChangeText={(text) => this.setState({ playlistEditName: text })}
                        label={"Playlist Name"}
                    />
                    <BasicInput
                        text={this.state.playlistEditDescription}
                        placeholder={"The best songs for driving..."}
                        label={"Playlist Description"}
                        onChangeText={(text) => this.setState({ playlistEditDescription: text })}
                        multiline={true}
                        numberOfLines={3}
                    />
                    <BasicInput
                        text={this.state.playlistEditIcon}
                        placeholder={"https://i.imgur.com/..."}
                        onChangeText={(text) => this.setState({ playlistEditIcon: text })}
                        label={"Playlist Icon URL"}
                    />
                    <BasicCheckbox
                        checked={this.state.playlistEditIsPrivate}
                        onPress={() => this.setState({ playlistEditIsPrivate: !this.state.playlistEditIsPrivate })}
                        label={"Public Playlist"}
                    />
                    </ScrollView>
                </BasicModal>
            </JumpInView>
        ) : null;
    }
}

export default PlaylistPage;
