import { useState } from "react";
import { View, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from "react-native";

import * as WebBrowser from "expo-web-browser";
import FastImage from "react-native-fast-image";
import EnIcon from "react-native-vector-icons/Entypo";
import MaIcon from "react-native-vector-icons/MaterialIcons";
import McIcon from "react-native-vector-icons/MaterialCommunityIcons";

import StyledMenu from "@components/StyledMenu";
import StyledModal from "@components/StyledModal";
import StyledText, { Size } from "@components/StyledText";

import SelectAPlaylist from "@modals/SelectAPlaylist";

import User from "@backend/user";
import Player from "@backend/player";
import Playlist from "@backend/playlist";
import Downloads from "@backend/downloads";
import { artist } from "@backend/search";
import { resolveIcon } from "@backend/utils";
import { useColor, useDownloads, useFavorites } from "@backend/stores";
import { DownloadInfo, OwnedPlaylist, RemoteInfo, TrackInfo } from "@backend/types";

import { value } from "@style/Laudiolin";

interface IProps {
    data: TrackInfo;
    playlist?: OwnedPlaylist;

    style?: ViewStyle | any;

    /**
     * This prop is applied to both elements of the track.
     */
    textStyle?: TextStyle | any;

    disabled?: boolean;
    onHold?: () => void;
}

function Track(props: IProps) {
    const { data, playlist } = props;

    const colors = useColor();

    let favorites = useFavorites();
    favorites = Object.values(favorites);

    const { isLocal } = useDownloads();

    const isFavorite = favorites.find(t => t.id == data.id);
    const local = isLocal(data.id);

    const [opened, setOpened] = useState(false);
    const [add, setShowAdd] = useState(false);

    return (
        <TouchableOpacity
            disabled={
                props.disabled ||
                (data.url == "" && data.duration == 0 && !local)
            }
            activeOpacity={0.7}
            style={{
                ...style.Track,
                ...props.style
            }}
            onPress={() => Player.play(data, { playlist, skip: true })}
            onLongPress={() => props.onHold ?
                props.onHold() : setOpened(true)}
        >
            <View style={style.Track_Container}>
                <FastImage
                    source={{ uri: resolveIcon(data.icon) }}
                    style={style.Track_Icon}
                />

                <View style={style.Track_Info}>
                    <StyledText
                        style={{
                            ...style.Track_Title,
                            ...props.textStyle
                        }}
                        text={data.title ?? ""}
                        ticker={(data.title ?? "").length > 25}
                    />

                    <StyledText
                        style={{
                            ...props.textStyle
                        }}
                        text={artist(data)}
                        size={Size.Footnote}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={style.Track_ContextMenu}
                onPress={() => setOpened(!opened)}
            >
                <EnIcon name={"dots-three-vertical"} size={16} color={colors.text} />
            </TouchableOpacity>

            <StyledModal
                visible={add}
                onPressOutside={() => setShowAdd(false)}
                style={style.Track_Modal}
                title={"Add Track to Playlist"}
            >
                <SelectAPlaylist
                    onSelect={playlist => {
                        Playlist.addTrackToPlaylist(playlist, data)
                            .catch(() => null);
                        setShowAdd(false);
                    }}
                />
            </StyledModal>

            <StyledMenu
                closeOnPress
                opened={opened}
                close={() => setOpened(false)}
                options={[
                    {
                        text: "Add to Queue",
                        icon: <MaIcon name={"queue"} size={24} color={colors.text} />,
                        onPress: () => Player.play(data, { playlist })
                    },
                    playlist?.id != "favorites" ? {
                        text: `${playlist ? "Remove from" : "Add to"} Playlist`,
                        icon: <McIcon name={"playlist-plus"} size={24} color={colors.text} />,
                        onPress: () => {
                            if (playlist) {
                                Playlist.removeTrackFromPlaylist(playlist, data)
                                    .catch(() => null);
                            } else {
                                setShowAdd(true);
                            }
                        }
                    } : undefined,
                    data.url.length > 0 ? {
                        text: "Open Track Source",
                        icon: <McIcon name={"web"} size={24} color={colors.text} />,
                        onPress: () => WebBrowser.openBrowserAsync(data.url)
                    } : undefined,
                    data.type == "remote" ? {
                        text: `${isFavorite ? "Remove from" : "Add to"} Favorites`,
                        icon: <McIcon name={"heart"} size={24} color={colors.text} />,
                        onPress: () => User.favoriteTrack(data, !isFavorite)
                    } : undefined,
                    {
                        text: `${local ? "Delete" : "Download"} Track`,
                        icon: <McIcon name={local ? "delete" : "download"} size={24} color={colors.text} />,
                        onPress: () => local ?
                            Downloads.remove(data as DownloadInfo) :
                            Downloads.download(data as RemoteInfo)
                    }
                ]}
                optionsStyle={{ width: 230 }}
            />
        </TouchableOpacity>
    );
}

export default Track;

const style = StyleSheet.create({
    Track: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    Track_Container: {
        flexDirection: "row",
        gap: 12
    },
    Track_Icon: {
        width: 64,
        height: 64,
        borderRadius: 10
    },
    Track_Info: {
        flexDirection: "column",
        alignSelf: "center"
    },
    Track_Title: {
        width: value.width - 140
    },
    Track_ContextMenu: {
        alignSelf: "center"
    },
    Track_Modal: {
        gap: 10
    }
});
