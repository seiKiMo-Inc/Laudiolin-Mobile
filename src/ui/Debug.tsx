import { useState } from "react";
import { ScrollView, StyleProp, View, ViewStyle } from "react-native";

import * as Updates from "expo-updates";
import { logger } from "react-native-logs";
import { useNavigation } from "@react-navigation/native";
import TrackPlayer, { RepeatMode, State, useActiveTrack, usePlaybackState } from "react-native-track-player";

import { alert } from "@widgets/Alert";
import ImportTrack from "@modals/ImportTrack";

import StyledText from "@components/StyledText";
import StyledButton from "@components/StyledButton";

import Gateway from "@backend/gateway";
import { Colors, useColor, useDebug } from "@backend/stores";
import Player, { usePlayer } from "@backend/player";

import { value } from "@style/Laudiolin";

const log = logger.createLogger();

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

    const [showImport, setShowImport] = useState(false);

    const [repeatMode, setRepeatMode] = useState(RepeatMode.Off);
    const [songIndex, setSongIndex] = useState<number | undefined>(0);

    return (
        <ScrollView
            style={{ padding: value.padding }}
            contentContainerStyle={{ gap: 15 }}
        >
            <StyledButton
                text={"Go Back"}
                onPress={() => navigation.goBack()}
            />

            <StyledButton
                text={"Reload"}
                onPress={() => Updates.reloadAsync()}
            />

            <StyledButton
                text={"Check for Updates"}
                onPress={async () => {
                    try {
                        const update = await Updates.checkForUpdateAsync();
                        if (update.isAvailable) {
                            alert("Update found!");
                            await Updates.fetchUpdateAsync();
                            await Updates.reloadAsync();
                        } else {
                            alert("No updates available");
                        }
                    } catch (error) {
                        log.error("Error checking for updates", error);
                    }
                }}
            />

            <StyledButton
                text={"Log Playback State"}
                buttonStyle={color(debug.playbackState, colors)}
                onPress={() => debug.update({ playbackState: !debug.playbackState })}
            />

            { debug.playbackState && (
                <View style={{ gap: 10 }}>
                    <StyledText text={`Playback state: ${playerState.state}`} bold />
                    { playerState.state == State.Error && (
                        <StyledText text={`Error: ${playerState.error}`} />
                    ) }
                </View>
            ) }

            <StyledButton
                text={"Log Track Info"}
                buttonStyle={color(debug.trackInfo, colors)}
                onPress={() => debug.update({ trackInfo: !debug.trackInfo })}
            />

            <StyledButton
                text={"Show Queue Info"}
                buttonStyle={color(queueInfo, colors)}
                onPress={() => showQueueInfo(!queueInfo)}
            />

            { queueInfo && (
                <View style={{ gap: 10 }}>
                    <StyledButton
                        text={"Clear Queue"}
                        buttonStyle={{ backgroundColor: colors.secondary }}
                        onPress={() => TrackPlayer.removeUpcomingTracks()}
                    />
                    <StyledButton
                        text={`Current Song: ${songIndex}`}
                        buttonStyle={{ backgroundColor: colors.secondary }}
                        onPress={() => TrackPlayer.getActiveTrackIndex().then(setSongIndex)}
                    />
                    <StyledButton
                        text={`Current Repeat: ${repeatMode}`}
                        buttonStyle={{ backgroundColor: colors.secondary }}
                        onPress={() => {
                            Player.nextRepeatMode().then(setRepeatMode);
                        }}
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

            <StyledButton
                text={"Import Local"}
                onPress={() => setShowImport(true)}
            />

            <StyledButton
                text={"Show Gateway Info"}
                buttonStyle={color(debug.gatewayMessages, colors)}
                onPress={() => debug.update({ gatewayMessages: !debug.gatewayMessages })}
            />

            { debug.gatewayMessages && <GatewayInfo /> }

            <ImportTrack opened={showImport} close={() => setShowImport(false)} />
        </ScrollView>
    );
}

export default Debug;

function GatewayInfo() {
    return (
        <View style={{ gap: 10 }}>
            <StyledText text={`Connected? ${Gateway.connected()}`} bold />
        </View>
    );
}
