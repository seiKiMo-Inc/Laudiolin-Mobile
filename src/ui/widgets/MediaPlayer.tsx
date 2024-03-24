import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import MdIcon from "react-native-vector-icons/MaterialIcons";
import McIcon from "react-native-vector-icons/MaterialCommunityIcons";

import FastImage from "react-native-fast-image";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import TrackPlayer, { State, useActiveTrack, usePlaybackState } from "react-native-track-player";

import StyledText, { Size } from "@components/StyledText";

import Player from "@backend/player";
import { artist } from "@backend/search";
import { useGlobal, useSettings } from "@backend/stores";

function MediaPlayer() {
    const global = useGlobal();
    const settings = useSettings();
    const navigation: NavigationProp<any> = useNavigation();

    const track = useActiveTrack();
    const { state } = usePlaybackState();

    return track ? (
        <View style={style.MediaPlayer}>
            <FastImage
                style={style.MediaPlayer_Image}
                source={{ uri: track.artwork }}
                resizeMode={"cover"}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={style.MediaPlayer_Background}
                    onPress={() => global.setShowTrackPage(true)}
                >
                    <View style={{
                        ...style.MediaPlayer_Info,
                        width: `${settings.ui.show_queue ? "65" : "75"}%`
                    }}>
                        <StyledText style={style.MediaPlayer_Text} text={track.title ?? "---"} size={Size.Text} />
                        <StyledText style={style.MediaPlayer_Text} text={artist(track.artist)} size={Size.Footnote} />
                    </View>

                    <View style={style.MediaPlayer_Controls}>
                        { settings.ui.show_queue && (
                            <TouchableOpacity onPress={() => navigation.navigate("Queue")}>
                                <MdIcon name={"queue-music"} size={32} color={"white"} />
                            </TouchableOpacity>
                        ) }

                        <TouchableOpacity
                            onPress={async () => {
                                if (state == State.Paused) {
                                    await TrackPlayer.play();
                                } else if (state == State.Playing) {
                                    await TrackPlayer.pause();
                                }
                            }}
                        >
                            <MdIcon name={state == State.Playing ? "pause" : "play-arrow"} size={32} color={"white"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => Player.skipToNext()}>
                            <McIcon name={"skip-next"} size={32} color={"white"} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </FastImage>
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
        padding: 10
    },
    MediaPlayer_Text: {
        color: "white"
    },
    MediaPlayer_Controls: {
        flexDirection: "row",
        paddingRight: 10,
        gap: 10
    }
});
