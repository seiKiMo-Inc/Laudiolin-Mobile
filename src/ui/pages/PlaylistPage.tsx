import React from "react";
import { FlatList, View, ListRenderItemInfo } from "react-native";

import Track from "@components/Track";
import BasicText from "@components/common/BasicText";

import { PlaylistPageStyle } from "@styles/PageStyles";

import { TrackData } from "@backend/types";
import { Icon, Image } from "@rneui/base";
import BasicButton from "@components/common/BasicButton";

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

class PlaylistPage extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    renderPlaylist(item: ListRenderItemInfo<TrackData>) {
        return (
            <Track key={item.index} track={item.item} padding={20} />
        );
    }

    render() {
        return this.props.showPage ? (
            <View style={PlaylistPageStyle.container}>
                <View style={PlaylistPageStyle.info}>
                    <Image
                        source={require("../../../resources/images/icon.png")}
                        style={PlaylistPageStyle.playlistIcon}
                    />

                    <View style={PlaylistPageStyle.text}>
                        <BasicText
                            text={"i'm literally losing my mind"}
                            style={PlaylistPageStyle.playlistName}
                        />
                        <BasicText
                            text={"natsu#4700"}
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
            </View>
        ) : null;
    }
}

export default PlaylistPage;
