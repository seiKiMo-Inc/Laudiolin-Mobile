import React from "react";
import { FlatList, View, ListRenderItemInfo } from "react-native";

import { Icon, Image } from "@rneui/base";
import BasicModal from "@components/common/BasicModal";
import Hide from "@components/Hide";
import Track from "@components/Track";
import BasicText from "@components/common/BasicText";
import BasicButton from "@components/common/BasicButton";
import JumpInView from "@components/common/JumpInView";
import BasicInput from "@components/common/BasicInput";
import BasicCheckbox from "@components/common/BasicCheckbox";

import { PlaylistPageStyle } from "@styles/PageStyles";

import { editPlaylist } from "@backend/playlist";
import { Playlist, TrackData } from "@backend/types";
import { playPlaylist, playTrack } from "@backend/audio";
import { navigate } from "@backend/navigation";
import { getPlaylistAuthor } from "@backend/user";
import emitter from "@backend/events";

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
        emitter.on("showPlaylist", this.onPlaylist);
    }

    componentWillUnmount() {
        emitter.removeListener("showPlaylist", this.onPlaylist);
    }

    /**
     * Renders a playlist track.
     * @param item The track data.
     */
    renderPlaylist(item: ListRenderItemInfo<TrackData>) {
        return (
            <Track
                key={item.index} track={item.item} padding={20}
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
                        <Image
                            source={{ uri: playlist?.icon }}
                            style={PlaylistPageStyle.playlistIcon}
                        />

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
                        renderItem={this.renderPlaylist}
                        showsHorizontalScrollIndicator={false}
                    />
                </Hide>

                <BasicModal
                    showModal={this.state.showEditPlaylistModal}
                    onSubmit={this.editPlaylistAsync}
                    title={"Create Playlist"}
                    onBackdropPress={() => this.setState({ showEditPlaylistModal: false })}
                >
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
                </BasicModal>
            </JumpInView>
        ) : null;
    }
}

export default PlaylistPage;
