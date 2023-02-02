import React from "react";
import { FlatList, View } from "react-native";
import { Icon, Image } from "@rneui/base";

import BasicText from "@components/common/BasicText";
import LinearGradient from "react-native-linear-gradient";

import { PlaylistsPageStyle } from "@styles/PageStyles";

import { navigate } from "@backend/navigation";

class Playlist extends React.Component<any, any> {
    render() {
        return (
            <View style={PlaylistsPageStyle.playlist}>
                {/* TODO: Change first color to average color of icon. */}
                <LinearGradient
                    style={PlaylistsPageStyle.playlistContent}
                    colors={["#f7e9d1", "transparent"]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                >
                    <Image
                        source={require("../../../resources/images/icon.png")}
                        style={PlaylistsPageStyle.playlistImage}
                    />

                    <View style={{ paddingLeft: 20, justifyContent: "center" }}>
                        <BasicText
                            text={"i'm literally losing my mind"}
                            style={PlaylistsPageStyle.playlistTitle}
                        />

                        <BasicText
                            text={"natsu#4700"}
                            style={PlaylistsPageStyle.playlistAuthor}
                        />
                    </View>

                    <Icon
                        color={"white"}
                        type="material" name={"more-vert"}
                        containerStyle={PlaylistsPageStyle.playlistMore}
                    />
                </LinearGradient>
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

    render() {
        return this.props.showPage ? (
            <View style={PlaylistsPageStyle.container}>
                <View style={PlaylistsPageStyle.header}>
                    <Icon name={"chevron-left"} type={"material"} color={"white"} size={35} onPress={() => navigate("Home")} underlayColor={"#FFF"} />
                    <BasicText text={"Playlists"} style={{ fontSize: 25, fontWeight: "bold", marginLeft: 10 }} />
                </View>

                <FlatList
                    contentContainerStyle={PlaylistsPageStyle.list}
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    renderItem={() => <Playlist />}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        ) : null;
    }
}

export default PlaylistsPage;
