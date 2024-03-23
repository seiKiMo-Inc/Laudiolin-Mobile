import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import AdIcon from "react-native-vector-icons/AntDesign";
import EnIcon from "react-native-vector-icons/Entypo";
import FaIcon from "react-native-vector-icons/FontAwesome6";
import IoIcon from "react-native-vector-icons/Ionicons";
import MdIcon from "react-native-vector-icons/MaterialIcons";
import McIcon from "react-native-vector-icons/MaterialCommunityIcons";

import * as WebBrowser from "expo-web-browser";
import FastImage from "react-native-fast-image";
import TrackPlayer, {
    RepeatMode,
    State,
    useActiveTrack,
    usePlaybackState,
    useProgress,
} from "react-native-track-player";
import { NavigationContainerRef } from "@react-navigation/core";
import { GestureDetector, Gesture, Directions } from "react-native-gesture-handler";

import ProgressBar from "@widgets/ProgressBar";
import SelectAPlaylist from "@modals/SelectAPlaylist";

import StyledMenu from "@components/StyledMenu";
import StyledModal from "@components/StyledModal";
import StyledText, { Size } from "@components/StyledText";

import User from "@backend/user";
import Playlist from "@backend/playlist";
import Player, { usePlayer } from "@backend/player";
import { Colors, useColor, useDownloads, useFavorites, useGlobal } from "@backend/stores";

import { value } from "@style/Laudiolin";
import Downloads from "@backend/downloads";
import { DownloadInfo, RemoteInfo } from "@backend/types";

function RepeatIcon({ loop, colors }: { loop: RepeatMode, colors: Colors }) {
    switch (loop) {
        case RepeatMode.Off:
            return <McIcon name={"repeat"} color={colors.text} size={28} />;
        case RepeatMode.Track:
            return <McIcon name={"repeat-once"} color={colors.accent} size={28} />;
        case RepeatMode.Queue:
            return <McIcon name={"repeat"} color={colors.accent} size={28} />;
    }
}

function NowPlaying({ navigation }: { navigation: NavigationContainerRef<any> }) {
    const global = useGlobal();
    const colors = useColor();

    let favorites = useFavorites();
    favorites = Object.values(favorites);

    const downloadData = useDownloads();
    const downloads = downloadData.downloaded;

    const { track: currentlyPlaying } = usePlayer();

    const track = useActiveTrack();
    const { state } = usePlaybackState();
    const progress = useProgress(500);

    const isFavorite = favorites.find(t => t.id == track?.id);
    const local = downloads.find(t => t.id == track?.id);

    const [repeatMode, setRepeatMode] = useState(RepeatMode.Off);

    const [showSelect, setShowSelect] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const fromPlaylist = track ? track.playlist : undefined;

    useEffect(() => {
        TrackPlayer.getRepeatMode().then(setRepeatMode);
    });

    const goBack = () => global.setShowTrackPage(false);
    const openQueue = () => {
        navigation.navigate("Queue");
        global.setShowTrackPage(false);
    };
    const backGesture = Gesture.Fling()
        .direction(Directions.DOWN)
        .onEnd(goBack);
    const queueGesture = Gesture.Fling()
        .direction(Directions.UP)
        .onEnd(openQueue);

    return (
        <GestureDetector gesture={Gesture.Exclusive(queueGesture, backGesture)}>
            <View style={{
                ...style.NowPlaying,
                backgroundColor: colors.primary
            }}>
                <View style={style.NowPlaying_Header}>
                    <TouchableOpacity onPress={() => global.setShowTrackPage(false)}>
                        <AdIcon name={"left"} size={28} color={colors.text} />
                    </TouchableOpacity>

                    { fromPlaylist && (
                        <View style={style.NowPlaying_Source}>
                            <StyledText uppercase text={"Playing from Playlist"}
                                        style={{ color: colors.gray }}
                            />
                            <StyledText bold text={fromPlaylist} />
                        </View>
                    ) }

                    <TouchableOpacity onPress={() => setShowMenu(true)}>
                        <EnIcon name={"dots-three-vertical"} size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <FastImage
                    style={style.NowPlaying_Cover}
                    source={{ uri: track?.artwork }}
                    resizeMode={"contain"}
                />

                <View style={{ flexDirection: "column" }}>
                    <View style={style.NowPlaying_Info}>
                        <StyledText text={track?.title ?? "Not Playing"}
                                    size={Size.Header} bold
                                    lines={value.height > 700 ? 3 : 2}
                        />

                        <StyledText text={track?.artist ?? "---"}
                                    style={{ color: colors.gray }}
                                    size={Size.Text} lines={1}
                        />
                    </View>

                    <ProgressBar
                        progress={progress.position}
                        duration={progress.duration}
                        style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 15 }}
                    />
                </View>

                <View style={style.NowPlaying_Controls}>
                    <TouchableOpacity onPress={() => Player.shuffle()}>
                        <FaIcon name={"shuffle"} color={colors.text} size={28} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Player.skipToPrevious()}>
                        <IoIcon name={"play-skip-back"} color={colors.text} size={28} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={async () => {
                        if (state == State.Paused) {
                            await TrackPlayer.play();
                        } else if (state == State.Playing) {
                            await TrackPlayer.pause();
                        }
                    }}>
                        <MdIcon name={state == State.Playing ? "pause" : "play-arrow"} color={colors.text} size={32} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Player.skipToNext()}>
                        <IoIcon name={"play-skip-forward"} color={colors.text} size={28} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Player.nextRepeatMode().then(setRepeatMode)}>
                        <RepeatIcon loop={repeatMode} colors={colors} />
                    </TouchableOpacity>
                </View>

                <StyledModal
                    visible={showSelect}
                    onPressOutside={() => setShowSelect(false)}
                >
                    <SelectAPlaylist
                        onSelect={playlist => {
                            if (currentlyPlaying && currentlyPlaying?.title == track?.title) {
                                Playlist.addTrackToPlaylist(playlist, currentlyPlaying)
                                    .catch(() => null);
                                setShowSelect(false);
                            }
                        }}
                    />
                </StyledModal>

                <StyledMenu
                    closeOnPress
                    opened={showMenu}
                    close={() => setShowMenu(false)}
                    options={[
                        currentlyPlaying && {
                            text: "Add to Playlist",
                            icon: <McIcon name={"playlist-plus"} size={24} color={colors.text} />,
                            onPress: () => setShowMenu(false),
                        },
                        currentlyPlaying && currentlyPlaying.url.length > 0 ? {
                            text: "Open Track Source",
                            icon: <McIcon name={"web"} size={24} color={colors.text} />,
                            onPress: () => WebBrowser.openBrowserAsync(currentlyPlaying!.url)
                        } : undefined,
                        currentlyPlaying ? {
                            text: `${isFavorite ? "Remove from" : "Add to"} Favorites`,
                            icon: <McIcon name={"heart"} size={24} color={colors.text} />,
                            onPress: () => {
                                if (currentlyPlaying?.type == "remote") {
                                    User.favoriteTrack(currentlyPlaying, !isFavorite)
                                        .catch(() => null);
                                }
                            }
                        } : undefined,
                        currentlyPlaying && {
                            text: `${local ? "Delete" : "Download"} Track`,
                            icon: <McIcon name={local ? "delete" : "download"} size={24} color={colors.text} />,
                            onPress: () => local ?
                                Downloads.remove(currentlyPlaying as DownloadInfo) :
                                Downloads.download(currentlyPlaying as RemoteInfo)
                        }
                    ]}
                    style={{ top: 10, right: 10 }}
                />
            </View>
        </GestureDetector>
    );
}

export default NowPlaying;

const style = StyleSheet.create({
    NowPlaying: {
        width: "100%",
        height: "100%",
        padding: value.padding,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    NowPlaying_Header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
    },
    NowPlaying_Source: {
        flexDirection: "column",
        alignItems: "center"
    },
    NowPlaying_Cover: {
        width: "80%",
        height: "50%",
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 15,
        resizeMode: "cover",
        aspectRatio: 1,
        borderRadius: 15,
    },
    NowPlaying_Info: {
        flexDirection: "column",
        alignItems: "flex-start",
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 15,
    },
    NowPlaying_Controls: {
        position: "relative",
        bottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
        alignSelf: "center",
        paddingTop: 30,
        paddingLeft: 25,
        paddingRight: 25
    }
});
