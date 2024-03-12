import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import AdIcon from "react-native-vector-icons/AntDesign";
import FaIcon from "react-native-vector-icons/FontAwesome";
import Fa6Icon from "react-native-vector-icons/FontAwesome6";
import EnIcon from "react-native-vector-icons/Entypo";

import FastImage from "react-native-fast-image";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import Track from "@widgets/Track";
import BackButton from "@widgets/BackButton";
import StyledButton from "@components/StyledButton";
import StyledText, { Size } from "@components/StyledText";

import Player from "@backend/player";
import Playlists from "@backend/playlist";
import { PlaylistInfo } from "@backend/types";

import { colors, value } from "@style/Laudiolin";

interface RouteParams {
    playlist: PlaylistInfo;
    playlistId?: string;
}

interface IProps {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
}

function Playlist(props: IProps) {
    const { route, navigation } = props;
    const { playlist: data, playlistId } = route.params as RouteParams;

    const [playlist, setPlaylist] = useState<PlaylistInfo | null | undefined>(data);
    const [author, setAuthor] = useState<string>("Unknown");

    useEffect(() => {
        if (playlistId && !playlist) {
            Playlists.fetchPlaylist(playlistId).then(setPlaylist);
        }
    }, [playlistId]);

    useEffect(() => {
        if (playlist) {
            Playlists.getAuthor(playlist.owner)
                .then(author => setAuthor(author ?? "Unknown"));
        }
    }, [playlist]);

    return playlist ? (
        <View style={style.Playlist}>
            <BackButton navigation={navigation} />

            <View style={style.Playlist_Info}>
                <FastImage
                    source={{ uri: playlist.icon }}
                    style={style.Playlist_Cover}
                />

                <View style={{ width: "50%", flexDirection: "column" }}>
                    <StyledText text={playlist.name} bold lines={2} size={Size.Subheader} />
                    <StyledText text={author} lines={1} size={Size.Text} />
                </View>
            </View>

            <View style={style.Playlist_Actions}>
                <View style={style.Playlist_ActionBar}>
                    <StyledButton
                        text={"Edit"}
                        style={style.Playlist_Button}
                        icon={<FaIcon
                            name={"edit"} size={20} color={"white"}
                            style={{ marginRight: 5 }}
                        />}
                        buttonStyle={{
                            backgroundColor: colors.secondary
                        }}
                    />
                </View>

                <View style={style.Playlist_ActionBar}>
                    <StyledButton
                        text={"Play"}
                        style={style.Playlist_Button}
                        icon={<EnIcon
                            name={"controller-play"} size={20} color={"white"}
                            style={{ marginRight: 5 }}
                        />}
                        buttonStyle={{ backgroundColor: colors.contrast }}
                        onPress={() => Player.queue({
                            tracks: playlist?.tracks,
                            clear: true, start: true,
                        })}
                    />

                    <StyledButton
                        text={"Shuffle"}
                        style={style.Playlist_Button}
                        icon={<Fa6Icon
                            name={"shuffle"} size={20} color={"white"}
                            style={{ marginRight: 5 }}
                        />}
                        buttonStyle={{ backgroundColor: colors.accent }}
                        onPress={() => Player.queue({
                            tracks: playlist?.tracks,
                            clear: true, start: true, shuffle: true
                        })}
                    />
                </View>
            </View>

            {
                playlist.tracks.length > 0 ?
                    <FlatList
                        data={playlist.tracks}
                        contentContainerStyle={{ gap: 10 }}
                        renderItem={({ item }) =>
                            <Track key={item.id} data={item} playlist={playlist} />}
                    />
                    :
                    <View>
                        <StyledText text={"Add some tracks to see them here!"}
                                    lines={2} bold size={Size.Text}
                                    style={style.Playlist_NoTracks}
                        />
                    </View>
            }
        </View>
    ) : undefined;
}

export default Playlist;

const style = StyleSheet.create({
    Playlist: {
        width: "100%",
        height: "100%",
        padding: value.padding,
        gap: 15
    },
    Playlist_Cover: {
        width: 120, height: 128,
        borderRadius: 20
    },
    Playlist_Info: {
        width: "100%",
        flexDirection: "row",
        gap: 15,
        alignItems: "center"
    },
    Playlist_Actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    Playlist_ActionBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    Playlist_Button: {
        borderRadius: 10
    },
    Playlist_NoTracks: {
        alignSelf: "center"
    }
});
