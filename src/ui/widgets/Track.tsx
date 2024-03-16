import { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import * as WebBrowser from "expo-web-browser";
import FastImage from "react-native-fast-image";
import EnIcon from "react-native-vector-icons/Entypo";
import McIcon from "react-native-vector-icons/MaterialCommunityIcons";

import StyledMenu from "@components/StyledMenu";
import StyledModal from "@components/StyledModal";
import StyledText, { Size } from "@components/StyledText";

import SelectAPlaylist from "@modals/SelectAPlaylist";

import Player from "@backend/player";
import Playlist from "@backend/playlist";
import { artist } from "@backend/search";
import { resolveIcon } from "@backend/utils";
import { useFavorites } from "@backend/stores";
import { OwnedPlaylist, TrackInfo } from "@backend/types";

import { value } from "@style/Laudiolin";

interface IProps {
    data: TrackInfo;
    playlist?: OwnedPlaylist;

    style?: any;

    disabled?: boolean;
    onHold?: () => void;
}

function Track(props: IProps) {
    const { data, playlist } = props;

    let favorites = useFavorites();
    favorites = Object.values(favorites);

    const isFavorite = favorites.find(t => t.id == data.id);

    const [opened, setOpened] = useState(false);
    const [add, setShowAdd] = useState(false);

    return (
        <TouchableOpacity
            disabled={props.disabled}
            activeOpacity={0.7}
            style={{
                ...style.Track,
                ...props.style
            }}
            onPress={() => Player.play(data, { playlist, reset: true })}
            onLongPress={() => props.onHold ?
                props.onHold() : setOpened(true)}
        >
            <View style={style.Track_Container}>
                <FastImage
                    source={{ uri: resolveIcon(data.icon) }}
                    style={style.Track_Icon}
                />

                <View style={style.Track_Info}>
                    <StyledText style={style.Track_Title} text={data.title ?? ""}
                                ticker={(data.title ?? "").length > 25} />
                    <StyledText text={artist(data)} size={Size.Footnote} />
                </View>
            </View>

            <TouchableOpacity
                style={style.Track_ContextMenu}
                onPress={() => setOpened(!opened)}
            >
                <EnIcon name={"dots-three-vertical"} size={16} color={"white"} />
            </TouchableOpacity>

            <StyledModal
                visible={add}
                onPressOutside={() => setShowAdd(false)}
                style={style.Track_Modal}
                title={"Add Track to Playlist"}
            >
                <SelectAPlaylist
                    onSelect={playlist => Playlist.addTrackToPlaylist(playlist, data)}
                />
            </StyledModal>

            <StyledMenu
                closeOnPress
                opened={opened}
                close={() => setOpened(false)}
                options={[
                    {
                        text: `${playlist ? "Remove from" : "Add to"} Playlist`,
                        icon: <McIcon name={"playlist-plus"} size={24} color={"white"} />,
                        onPress: () => {
                            if (playlist) {
                                Playlist.removeTrackFromPlaylist(playlist, data)
                                    .catch(() => null);
                            } else {
                                setShowAdd(true);
                            }
                        }
                    },
                    {
                        text: "Open Track Source",
                        icon: <McIcon name={"web"} size={24} color={"white"} />,
                        onPress: () => WebBrowser.openBrowserAsync(data.url)
                    },
                    data.type == "remote" ? {
                        text: `${isFavorite ? "Remove from" : "Add to"} Favorites`,
                        icon: <McIcon name={"heart"} size={24} color={"white"} />,
                        onPress: () => console.log("Add to Favorites")
                    } : undefined
                ]}
                optionsStyle={{ width: 225 }}
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
