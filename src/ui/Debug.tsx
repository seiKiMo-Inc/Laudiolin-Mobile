import { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useNavigation } from "@react-navigation/native";
import TrackPlayer, { Track, useActiveTrack, usePlaybackState } from "react-native-track-player";

import StyledText from "@components/StyledText";
import StyledButton from "@components/StyledButton";

import { useDebug } from "@backend/stores";

import { colors, value } from "@style/Laudiolin";

function color(enabled: boolean): StyleProp<ViewStyle> {
    return { backgroundColor: enabled ? "green" : colors.accent };
}

function Debug() {
    const debug = useDebug();
    const navigation = useNavigation();

    const playingTrack = useActiveTrack();
    const playerState = usePlaybackState();

    const [queueInfo, showQueueInfo] = useState(false);
    const [trackInfo, showTrackInfo] = useState(false);

    const [queue, setQueue] = useState<Track[]>([]);

    useEffect(() => {
        if (queueInfo) {
            TrackPlayer.getQueue().then(setQueue);
        }
    }, [playerState]);

    return (
        <View style={{ padding: value.padding, gap: 15 }}>
            <StyledButton
                text={"Go Back"}
                onPress={() => navigation.goBack()}
            />

            <StyledButton
                text={"Log Playback State"}
                buttonStyle={color(debug.playbackState)}
                onPress={() => debug.update({ playbackState: !debug.playbackState })}
            />

            { debug.playbackState && (
                <View style={{ gap: 10 }}>
                    <StyledText text={`Playback state: ${playerState.state}`} bold />
                </View>
            ) }

            <StyledButton
                text={"Show Queue Info"}
                buttonStyle={color(queueInfo)}
                onPress={() => {
                    showQueueInfo(!queueInfo);
                    TrackPlayer.getQueue().then(setQueue);
                }}
            />

            { queueInfo && (
                <View style={{ gap: 10 }}>
                    <StyledText text={`Songs in queue: ${queue.length}`} bold />
                    <StyledButton
                        text={"Clear Queue"}
                        onPress={() => TrackPlayer.removeUpcomingTracks()}
                    />
                </View>
            ) }

            <StyledButton
                text={"Show Track Info"}
                buttonStyle={color(trackInfo)}
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
