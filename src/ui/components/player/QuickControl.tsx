import React from "react";
import { Dimensions, TouchableWithoutFeedback, View } from "react-native";

import { Icon, Image } from "@rneui/base";
import BasicText from "@components/common/BasicText";
import LinearGradient from "react-native-linear-gradient";

import { ControlStyle } from "@styles/WidgetStyle";

import { ui } from "@backend/settings";
import { getIconUrl } from "@app/utils";
import { isListeningWith } from "@backend/social";
import { asData, getCurrentTrack, forcePause } from "@app/backend/audio";

import TrackPlayer, { Event, State, Track } from "react-native-track-player";

interface IProps {
    showPlayingTrackPage: () => void;
    isQuickControlVisible: (visible: boolean) => void;
}

interface IState {
    paused: boolean;
    track: Track|null;
    trackProgressPercentage: number;
}

class QuickControl extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            paused: false,
            track: null,
            trackProgressPercentage: 0
        };

        // Register track player listeners.
        TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, () => this.setTrackProgressPercentage(TrackPlayer.getPosition()));
        TrackPlayer.addEventListener(Event.PlaybackTrackChanged, () => this.update());
        TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => this.update());
        TrackPlayer.addEventListener(Event.PlaybackState, () => this.update());
    }

    /**
     * Updates the quick control center.
     */
    async update(): Promise<void> {
        const playerState = await TrackPlayer.getState();

        // Clear state if playerState is None.
        if (playerState == State.None) {
            await TrackPlayer.reset();
            this.setState({ track: null });
        }

        // Update the state.
        this.setState({
            track: await getCurrentTrack(),
            paused: await TrackPlayer.getState() == State.Paused
        });
    }

    /**
     * Toggles the playback state of the audio player.
     */
    async togglePlayback(): Promise<void> {
        // Check if the player is paused.
        if (await TrackPlayer.getState() == State.Paused)
            await TrackPlayer.play();
        else
            await TrackPlayer.pause();

        // Update the component.
        await this.update();
    }

    /**
     * Skips to the next track in queue.
     */
    async skip(): Promise<void> {
        await TrackPlayer.skipToNext();
    }

    async componentDidMount(): Promise<void> {
        this.setState({ track: await getCurrentTrack() });

        if (this.state.track != null)
            this.props.isQuickControlVisible(true);
    }

    setTrackProgressPercentage = async (progress: Promise<number>) => {
        const duration = this.state.track?.duration ?? 0;
        const percentage = (await progress / duration) * 100;

        this.setState({ trackProgressPercentage: percentage });
        await this.update();
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (this.state.track != null && prevState.track == null)
            this.props.isQuickControlVisible(true);
        else if (this.state.track == null && prevState.track != null)
            this.props.isQuickControlVisible(false);
    }

    render() {
        const track = this.state.track;
        const toggle = (this.state.paused || forcePause) ? "play-arrow" : "pause";
        let artwork = track ? getIconUrl(asData(track)) : "";

        return track != null ? (
            <TouchableWithoutFeedback onPress={() => this.props.showPlayingTrackPage()}>
                <View style={ControlStyle.container}>
                    <View style={{ justifyContent: "center" }}>
                        <View style={{
                            height: 64,
                            width: Dimensions.get("window").width - 32,
                            position: "absolute",
                            backgroundColor: "transparent",
                            borderRadius: 22,
                            overflow: "hidden"
                        }}>
                            {
                                ui().progress_fill == "Gradient" ?
                                    <LinearGradient
                                        colors={["#1e85ad", "transparent"]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        angle={90}
                                        angleCenter={{ x: 0.5, y: 0.5 }}
                                        useAngle={true}
                                        style={{
                                            height: 65,
                                            width: `${this.state.trackProgressPercentage}%`,
                                            position: "absolute"
                                        }}
                                    />
                                    :
                                    <View style={{
                                        height: 65,
                                        width: `${this.state.trackProgressPercentage}%`,
                                        position: "absolute",
                                        backgroundColor: "#1e85ad"
                                    }}/>
                            }
                        </View>

                        <Image
                            source={{ uri: artwork }}
                            style={ControlStyle.image}
                        >
                            <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", height: "100%", width: "100%", borderRadius: 20 }} />
                        </Image>
                    </View>

                    <View style={{ justifyContent: "center" }}>
                        <View style={ControlStyle.controls}>
                            <Icon
                                color={isListeningWith() ? "#D0D0D0FF" : "#FFFFFF"}
                                type={"material"} name={toggle}
                                iconStyle={ControlStyle.button}
                                onPress={() => !isListeningWith() && this.togglePlayback()}
                            />

                            <Icon
                                color={isListeningWith() ? "#D0D0D0FF" : "#FFFFFF"}
                                type={"material"} name={"skip-next"}
                                iconStyle={ControlStyle.button}
                                onPress={() => !isListeningWith() && this.skip()}
                            />
                        </View>

                        <View style={ControlStyle.info}>
                            <BasicText
                                text={track?.title ?? ""}
                                numberOfLines={1}
                                style={{ fontSize: 17 }}
                                containerStyle={{ width: Dimensions.get("window").width - 220 }}
                            />
                            <BasicText
                                text={track?.artist ?? ""}
                                style={{ fontSize: 14 }}
                                numberOfLines={1}
                                containerStyle={{ width: Dimensions.get("window").width - 220 }}
                            />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        ) : null;
    }
}

export default QuickControl;
