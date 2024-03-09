import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";

import MdIcon from "react-native-vector-icons/MaterialIcons";
import McIcon from "react-native-vector-icons/MaterialCommunityIcons";

import TrackPlayer, { State, useActiveTrack, usePlaybackState } from "react-native-track-player";

import StyledText, { Size } from "@components/StyledText";

import { artist } from "@backend/search";
import { useGlobal } from "@backend/stores";

function MediaPlayer() {
    const global = useGlobal();

    const track = useActiveTrack();
    const { state } = usePlaybackState();

    return track ? (
        <View style={style.MediaPlayer}>
            <ImageBackground
                imageStyle={style.MediaPlayer_Image}
                source={{ uri: track.artwork }}
                resizeMode={"cover"}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={style.MediaPlayer_Background}
                    onPress={() => global.setShowTrackPage(true)}
                >
                    <View style={style.MediaPlayer_Info}>
                        <StyledText text={track.title ?? "---"} size={Size.Text} />
                        <StyledText text={artist(track.artist)} size={Size.Footnote} />
                    </View>

                    <View style={style.MediaPlayer_Controls}>
                        <TouchableOpacity
                            onPress={async () => {
                                if (state == State.Paused) {
                                    await TrackPlayer.play();
                                } else if (state == State.Playing) {
                                    await TrackPlayer.pause();
                                }
                            }}
                        >
                            <MdIcon name={state == State.Paused ? "play-arrow" : "pause"} size={32} color={"white"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
                            <McIcon name={"skip-next"} size={32} color={"white"} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    ) : undefined;
}

export default MediaPlayer;

const style = StyleSheet.create({
    MediaPlayer: {
        padding: 5,
        width: "100%",
        height: 65,
        overflow: "hidden",
        borderRadius: 20,
        marginBottom: 5
    },
    MediaPlayer_Image: {
        borderRadius: 20
    },
    MediaPlayer_Background: {
        height: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingLeft: 5,
        paddingRight: 5,
    },
    MediaPlayer_Info: {
        width: "75%",
        padding: 10
    },
    MediaPlayer_Controls: {
        flexDirection: "row",
        paddingRight: 10,
        gap: 10
    }
});
