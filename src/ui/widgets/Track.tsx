import { useState } from "react";
import { View, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from "react-native";

import FastImage from "react-native-fast-image";
import EnIcon from "react-native-vector-icons/Entypo";

import StyledModal from "@components/StyledModal";
import StyledText, { Size } from "@components/StyledText";

import TrackMenu from "@menus/TrackMenu";
import SelectAPlaylist from "@modals/SelectAPlaylist";

import Player from "@backend/player";
import Playlist from "@backend/playlist";
import { artist } from "@backend/search";
import { resolveIcon } from "@backend/utils";
import { useColor, useDownloads } from "@backend/stores";
import { OwnedPlaylist, TrackInfo } from "@backend/types";

import { value } from "@style/Laudiolin";

interface IProps {
    data: TrackInfo;
    playlist?: OwnedPlaylist;

    queue?: boolean;

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

    const { isLocal } = useDownloads();

    const local = isLocal(data.id);

    const [opened, setOpened] = useState(false);
    const [add, setShowAdd] = useState(false);

    const disabled = props.disabled ||
        (data.url == "" && data.duration == 0 && !local);

    return (
        <TouchableOpacity
            disabled={disabled}
            activeOpacity={0.7}
            style={{
                ...style.Track,
                ...props.style,
                opacity: disabled ? 0.5 : 1
            }}
            delayLongPress={250}
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

            <TrackMenu
                opened={opened}
                close={() => setOpened(false)}
                showAdd={() => setShowAdd(true)}
                track={data}
                hideAddQueue={props.queue}
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
