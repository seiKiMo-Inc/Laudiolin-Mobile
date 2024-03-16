import { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useNavigation } from "@react-navigation/native";
import TrackPlayer, { RepeatMode, useActiveTrack, usePlaybackState } from "react-native-track-player";

import StyledText from "@components/StyledText";
import StyledButton from "@components/StyledButton";

import { Colors, useColor, useDebug } from "@backend/stores";
import Player, { currentlyPlaying, useQueue } from "@backend/player";

import { value } from "@style/Laudiolin";

function color(enabled: boolean, colors: Colors): StyleProp<ViewStyle> {
    return { backgroundColor: enabled ? "green" : colors.accent };
}

function Debug() {
    const debug = useDebug();
    const colors = useColor();

    const navigation = useNavigation();

    const playingTrack = useActiveTrack();
    const playerState = usePlaybackState();

    const [queueInfo, showQueueInfo] = useState(false);
    const [trackInfo, showTrackInfo] = useState(false);
    const [newQueueInfo, setNewQueueInfo] = useState(false);

    const [repeatMode, setRepeatMode] = useState(RepeatMode.Off);
    const [songIndex, setSongIndex] = useState<number | undefined>(0);

    const queue = useQueue();

    return (
        <View style={{ padding: value.padding, gap: 15 }}>
            <StyledButton
                text={"Go Back"}
                onPress={() => navigation.goBack()}
            />

            <StyledButton
                text={"Log Playback State"}
                buttonStyle={color(debug.playbackState, colors)}
                onPress={() => debug.update({ playbackState: !debug.playbackState })}
            />

            { debug.playbackState && (
                <View style={{ gap: 10 }}>
                    <StyledText text={`Playback state: ${playerState.state}`} bold />
                </View>
            ) }

            <StyledButton
                text={"Show Queue Info"}
                buttonStyle={color(queueInfo, colors)}
                onPress={() => showQueueInfo(!queueInfo)}
            />

            { queueInfo && (
                <View style={{ gap: 10 }}>
                    <StyledButton
                        text={"Clear Queue"}
                        onPress={() => TrackPlayer.removeUpcomingTracks()}
                    />
                    <StyledButton
                        text={`Current Song: ${songIndex}`}
                        onPress={() => TrackPlayer.getActiveTrackIndex().then(setSongIndex)}
                    />
                    <StyledButton
                        text={`Current Repeat: ${repeatMode}`}
                        onPress={() => {
                            Player.nextRepeatMode().then(setRepeatMode);
                        }}
                    />
                </View>
            ) }

            <StyledButton
                text={"Show New Queue Info"}
                buttonStyle={color(newQueueInfo, colors)}
                onPress={() => setNewQueueInfo(!newQueueInfo)}
            />

            { newQueueInfo && (
                <View style={{ gap: 10 }}>
                    <StyledText text={`Songs in queue: ${queue.size()}`} bold />
                    <StyledText text={`Next Song: ${queue.peek()?.title ?? "No song in queue"}`} />
                    <StyledText text={`Currently playing song: ${currentlyPlaying?.title ?? "None"}`} />

                    <StyledButton
                        text={`Current Repeat: ${repeatMode}`}
                        onPress={() => {
                            Player.nextRepeatMode().then(setRepeatMode);
                        }}
                    />

                    <StyledButton
                        text={"Remove Element"}
                        onPress={() => queue.dequeue()}
                    />
                </View>
            ) }

            <StyledButton
                text={"Show Track Info"}
                buttonStyle={color(trackInfo, colors)}
                onPress={() => showTrackInfo(!trackInfo)}
            />

            { trackInfo && (
                <View style={{ gap: 10 }}>
                    <StyledText text={`Current track: ${playingTrack?.title ?? "None"}`} />
                    <StyledText text={`Current artist: ${playingTrack?.artist ?? "None"}`} />
                </View>
            ) }
        </View>
    );
}

export default Debug;
