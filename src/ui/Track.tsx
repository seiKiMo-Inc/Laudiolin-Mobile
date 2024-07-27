import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator } from "react-native";

import EnIcon from "react-native-vector-icons/Entypo";
import FeIcon from "react-native-vector-icons/Feather";
import MaIcon from "react-native-vector-icons/MaterialIcons";
import McIcon from "react-native-vector-icons/MaterialCommunityIcons";

import FastImage from "react-native-fast-image";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import useFavorite from "@hooks/useFavorite";

import TrackMenu from "@menus/TrackMenu";
import BackButton from "@widgets/BackButton";
import SelectAPlaylist from "@modals/SelectAPlaylist";

import StyledMenu from "@components/StyledMenu";
import StyledModal from "@components/StyledModal";
import StyledButton from "@components/StyledButton";
import StyledText, { Size } from "@components/StyledText";

import User from "@backend/user";
import Player from "@backend/player";
import Backend from "@backend/backend";
import Playlist from "@backend/playlist";
import { resolveIcon } from "@backend/utils";
import { useColor } from "@backend/stores";
import { TrackInfo } from "@backend/types";

import { value } from "@style/Laudiolin";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RouteParams {
    id?: string;
    track?: TrackInfo;
}

interface IProps {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
}

function Track({ navigation, route }: IProps) {
    const safeArea = useSafeAreaInsets();
    const { id, track: _track } = route.params as RouteParams;

    const colors = useColor();

    const [track, setTrack] = useState<TrackInfo | undefined>(_track);
    const [menuOpened, setMenuOpened] = useState(false);
    const [playMenuOpened, setPlayMenuOpened] = useState(false);
    const [addToPlaylist, setAddToPlaylist] = useState(false);

    const isFavorite = useFavorite(track);

    useEffect(() => {
        if (!track && id) {
            Backend.fetchTrack(id)
                .then(setTrack)
                .catch(() => null);
        }
    }, [route]);

    return (
        <View style={{
            paddingTop: value.padding + safeArea.top,
            ...style.Track
        }}>
            <BackButton navigation={navigation} />

            { track ? <>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={style.Track_Info}
                    onLongPress={() => setMenuOpened(true)}
                >
                    <FastImage
                        source={{ uri: resolveIcon(track?.icon) }}
                        style={style.Track_Cover}
                    />

                    <View style={style.Track_Details}>
                        <StyledText text={track?.title ?? "No Title"}
                                    bold size={Size.Subheader} lines={3}
                        />
                        <StyledText text={track?.artist ?? "Unknown"} ticker />
                    </View>
                </TouchableOpacity>

                <View style={style.Track_Actions}>
                    <StyledMenu
                        closeOnPress
                        opened={playMenuOpened}
                        close={() => setPlayMenuOpened(false)}
                        options={[
                            {
                                text: "Add to Queue",
                                icon: <MaIcon name={"queue"} size={24} color={colors.text} />,
                                onPress: () => Player.play(track)
                            },
                            {
                                text: "Play Now",
                                icon: <EnIcon name={"controller-play"} size={24} color={colors.text} />,
                                onPress: () => Player.play(track, { skip: true })
                            }
                        ]}
                    />

                    <View style={style.Track_Pair}>
                        <StyledButton
                            text={"Play"}
                            icon={<EnIcon
                                name={"controller-play"} size={20} color={colors.text}
                                style={{ marginRight: 5 }}
                            />}
                            style={style.Track_Button}
                            buttonStyle={{
                                backgroundColor: colors.contrast
                            }}
                            onPress={() => Player.play(track, { skip: true })}
                            onHold={() => setPlayMenuOpened(true)}
                        />

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => Share.share({
                                url: `${Backend.getBaseUrl()}/track/${track.id}`
                            })}
                        >
                            <FeIcon name={"share"} size={28} color={colors.text} />
                        </TouchableOpacity>

                        { track.type == "remote" && (
                            <TouchableOpacity
                                onPress={() => User.favoriteTrack(track, !isFavorite)}
                            >
                                <McIcon name={"heart"} size={32}
                                        color={isFavorite ? colors.red : colors.text}
                                />
                            </TouchableOpacity>
                        ) }
                    </View>

                    <View style={style.Track_Pair}>
                        <StyledButton
                            text={"Add to Playlist"}
                            style={style.Track_Button}
                            onPress={() => setAddToPlaylist(true)}
                        />
                    </View>
                </View>

                <ScrollView
                    style={style.Track_Lyrics}
                    showsVerticalScrollIndicator={false}
                >
                    <StyledText text={"No lyrics found!"} />
                </ScrollView>

                <TrackMenu
                    opened={menuOpened}
                    close={() => setMenuOpened(false)}
                    track={track}
                    style={{ top: 10, right: 10 }}
                    hideShowDetails
                />

                <StyledModal
                    visible={addToPlaylist}
                    style={{ gap: 10 }}
                    onPressOutside={() => setAddToPlaylist(false)}
                    title={"Add Track to Playlist"}
                >
                    <SelectAPlaylist
                        onSelect={playlist => {
                            if (!track) return;

                            Playlist.addTrackToPlaylist(playlist, track)
                                .catch(() => null);
                            setAddToPlaylist(false);
                        }}
                    />
                </StyledModal>
            </> : (
                <ActivityIndicator
                    size={"large"}
                />
            ) }
        </View>
    );
}

export default Track;

const style = StyleSheet.create({
    Track: {
        padding: value.padding,
        width: "100%",
        height: "100%",
        gap: 15
    },
    Track_Info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15
    },
    Track_Cover: {
        width: 150,
        height: 150,
        borderRadius: 10
    },
    Track_Details: {
        width: "50%",
        flexDirection: "column",
        gap: 5
    },
    Track_Actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    Track_Pair: {
        alignItems: "center",
        flexDirection: "row",
        gap: 10
    },
    Track_Lyrics: {
        height: 200
    },
    Track_Button: {
        borderRadius: 10,
    }
});
