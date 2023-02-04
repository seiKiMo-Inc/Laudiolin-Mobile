import React from "react";
import { FlatList, View, ListRenderItemInfo } from "react-native";

import { Icon, Image } from "@rneui/base";
import Hide from "@components/Hide";
import Track from "@components/Track";
import BasicText from "@components/common/BasicText";
import BasicButton from "@components/common/BasicButton";
import JumpInView from "@components/common/JumpInView";

import { PlaylistPageStyle } from "@styles/PageStyles";

import { Playlist, TrackData } from "@backend/types";
import { playTrack } from "@backend/audio";
import emitter from "@backend/events";

interface IProps {
    showPage: boolean;
}

interface IState {
    playlist: Playlist|null;
}

class PlaylistPage extends React.Component<IProps, IState> {
    onPlaylist = (playlist: Playlist) => this.setState({ playlist });

    constructor(props: IProps) {
        super(props);

        this.state = {
            playlist: null
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

    render() {
        // Check for a valid playlist.
        const { playlist } = this.state;

        return this.props.showPage ? (
            <JumpInView visible={this.props.showPage} style={PlaylistPageStyle.container}>
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
                                text={playlist?.owner ?? ""}
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
                        />

                        <Icon
                            type={"material"} name={"favorite"}
                            iconStyle={PlaylistPageStyle.favoriteIcon}
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
                        />
                    </View>

                    <FlatList
                        style={PlaylistPageStyle.tracks}
                        data={this.getPlaylistTracks()}
                        renderItem={this.renderPlaylist}
                        showsHorizontalScrollIndicator={false}
                    />
                </Hide>
            </JumpInView>
        ) : null;
    }
}

export default PlaylistPage;
