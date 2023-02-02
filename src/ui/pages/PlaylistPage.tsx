import React from "react";
import { FlatList, View, ListRenderItemInfo } from "react-native";

import { Icon, Image } from "@rneui/base";
import Hide from "@components/Hide";
import Track from "@components/Track";
import BasicText from "@components/common/BasicText";
import BasicButton from "@components/common/BasicButton";

import { PlaylistPageStyle } from "@styles/PageStyles";

import { Playlist, TrackData } from "@backend/types";
import emitter from "@backend/events";

const testTrack = {
    title: "Hikaru Nara (Your Lie In April)",
    artist: "Otaku",
    icon: "https://i.scdn.co/image/ab67616d0000b273cbd6575a821e3a9bee15fc93",
    url: "https://open.spotify.com/track/1eznJLhlnbXrXuO8Ykkhhg",
    id: "FRR642100241",
    duration: 117
};

interface IProps {
    showPage: boolean;
}

interface IState {
    playlist: Playlist|null;
}

class PlaylistPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            playlist: null
        };

        emitter.on("showPlaylist", (playlist: Playlist) =>
            this.setState({ playlist }));
    }

    /**
     * Renders a playlist track.
     * @param item The track data.
     */
    renderPlaylist(item: ListRenderItemInfo<TrackData>) {
        return (
            <Track key={item.index} track={item.item} padding={20} />
        );
    }

    render() {
        // Check for a valid playlist.
        const { playlist } = this.state;

        return this.props.showPage ? (
            <View style={PlaylistPageStyle.container}>
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
                        data={[testTrack]}
                        renderItem={this.renderPlaylist}
                        showsHorizontalScrollIndicator={false}
                    />
                </Hide>
            </View>
        ) : null;
    }
}

export default PlaylistPage;
