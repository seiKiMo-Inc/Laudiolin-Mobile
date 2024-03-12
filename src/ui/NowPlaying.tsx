import { StyleSheet, TouchableOpacity, View } from "react-native";

import AdIcon from "react-native-vector-icons/AntDesign";
import EnIcon from "react-native-vector-icons/Entypo";
import FaIcon from "react-native-vector-icons/FontAwesome6";
import IoIcon from "react-native-vector-icons/Ionicons";
import MdIcon from "react-native-vector-icons/MaterialIcons";

import FastImage from "react-native-fast-image";
import TrackPlayer, { State, useActiveTrack, usePlaybackState, useProgress } from "react-native-track-player";

import ProgressBar from "@widgets/ProgressBar";
import StyledText, { Size } from "@components/StyledText";

import Player from "@backend/player";
import { useGlobal } from "@backend/stores";

import { colors, value } from "@style/Laudiolin";

function NowPlaying() {
    const global = useGlobal();

    const track = useActiveTrack();
    const { state } = usePlaybackState();
    const progress = useProgress(500);

    return (
        <View style={style.NowPlaying}>
            <View style={style.NowPlaying_Header}>
                <TouchableOpacity onPress={() => global.setShowTrackPage(false)}>
                    <AdIcon name={"left"} size={28} color={"white"} />
                </TouchableOpacity>

                { global.fromPlaylist && (
                    <View style={style.NowPlaying_Source}>
                        <StyledText uppercase text={"Playing from Playlist"}
                                    style={{ color: colors.gray }}
                        />
                        <StyledText bold text={global.fromPlaylist} />
                    </View>
                ) }

                <TouchableOpacity onPress={() => null}>
                    <EnIcon name={"dots-three-vertical"} size={24} color={"white"} />
                </TouchableOpacity>
            </View>

            <FastImage
                style={style.NowPlaying_Cover}
                source={{ uri: track?.artwork }}
                resizeMode={"contain"}
            />

            <View style={style.NowPlaying_Info}>
                <StyledText text={track?.title ?? "Not Playing"}
                            size={Size.Header} lines={3} bold
                />

                <StyledText text={track?.artist ?? "---"}
                            style={{ color: colors.gray }}
                            size={Size.Text} lines={3}
                />
            </View>

            <ProgressBar
                progress={progress.position}
                duration={progress.duration}
                style={{ paddingLeft: 10, paddingRight: 10 }}
            />

            <View style={style.NowPlaying_Controls}>
                <TouchableOpacity onPress={() => Player.shuffle()}>
                    <FaIcon name={"shuffle"} color={"white"} size={28} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
                    <IoIcon name={"play-skip-back"} color={"white"} size={28} />
                </TouchableOpacity>

                <TouchableOpacity onPress={async () => {
                    if (state == State.Paused) {
                        await TrackPlayer.play();
                    } else if (state == State.Playing) {
                        await TrackPlayer.pause();
                    }
                }}>
                    <MdIcon name={state == State.Playing ? "pause" : "play-arrow"} color={"white"} size={32} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
                    <IoIcon name={"play-skip-forward"} color={"white"} size={28} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <AdIcon name={"heart"} color={"white"} size={28} />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }} />
        </View>
    );
}

export default NowPlaying;

const style = StyleSheet.create({
    NowPlaying: {
        width: "100%",
        height: "100%",
        backgroundColor: colors.primary,
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 50,
        paddingTop: 30,
        paddingLeft: 25,
        paddingRight: 25
    }
});
