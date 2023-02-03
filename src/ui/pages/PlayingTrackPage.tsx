import React from "react";
import { View, ImageBackground } from "react-native";

import { Icon, Image } from "@rneui/themed";
import BasicText from "@components/common/BasicText";
import ProgressBar from "@components/player/ProgressBar";
import Controls from "@components/player/Controls";

import { PlayingTrackPageStyle } from "@styles/PageStyles";

import { getCurrentTrack, shuffleQueue } from "@backend/audio";
import TrackPlayer, { Event, State, Track } from "react-native-track-player";
import { navigate } from "@backend/navigation";
import JumpInView from "@components/common/JumpInView";

interface IProps {
    showPage: boolean;
}

interface IState {
    track: Track|null;
    position: number;
    paused: boolean;
}

class PlayingTrackPage extends React.Component<IProps, IState> {
    updateInterval: any|null = null;

    constructor(props: IProps) {
        super(props);

        this.state = {
            track: null,
            position: 0,
            paused: false
        };

        // Register track player listeners.
        TrackPlayer.addEventListener(Event.PlaybackTrackChanged, () => this.update());
        TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => this.update());
        TrackPlayer.addEventListener(Event.PlaybackState, () => this.update());
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
     * Called when the track player updates.
     */
    async positionUpdate() {
        // Set the state.
        this.setState({
            position: await TrackPlayer.getPosition()
        });
    }

    /**
     * Called when the track player updates.
     */
    async update() {
        const track = await getCurrentTrack();

        // Set the state.
        this.setState({
            track: track ?? this.state.track,
            position: await TrackPlayer.getPosition(),
            paused: await TrackPlayer.getState() == State.Paused
        });
    }

    componentDidMount() {
        this.updateInterval = setInterval(() => this.positionUpdate(), 500);
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    render() {
        let { track } = this.state;
        if (!track) return null;

        return this.props.showPage ? (
                <JumpInView visible={this.props.showPage} style={PlayingTrackPageStyle.view}>
                    <ImageBackground
                        style={PlayingTrackPageStyle.background}
                        source={{ uri: track.artwork as string }}
                        blurRadius={50}
                    >
                        <View style={{ ...PlayingTrackPageStyle.background, backgroundColor: "rgba(0,0,0, 0.6)" }} />
                    </ImageBackground>

                    <View style={PlayingTrackPageStyle.topBar}>
                        <Icon
                            name={"chevron-left"}
                            type={"material"}
                            size={30}
                            color={"#FFFFFF"}
                            onPress={() => navigate("Home")}
                        />

                        <View style={PlayingTrackPageStyle.topBarText}>
                            <BasicText
                                text={"Playing From Playlist"}
                                style={{ textTransform: "uppercase" }}
                            />
                            <BasicText
                                text={"Favorites"}
                                style={{ fontWeight: "bold", color: "#FFFFFF" }}
                            />
                        </View>

                        <Icon
                            name={"more-vert"}
                            type={"material"}
                            size={30}
                            color={"#FFFFFF"}
                            onPress={() => null /* TODO: Make more-vert menu */}
                        />
                    </View>

                    <View style={PlayingTrackPageStyle.trackInfo}>
                        <Image
                            style={PlayingTrackPageStyle.trackImage}
                            source={{ uri: track.artwork as string }}
                        />

                        <View style={{ padding: 25, flexDirection: "column", gap: 10 }}>
                            <BasicText
                                numberOfLines={2}
                                style={{ color: "#FFFFFF", fontSize: 25 }}
                                text={track.title ?? ""}
                            />
                            <BasicText
                                numberOfLines={1}
                                style={{ color: "#a1a1a1", fontSize: 15 }}
                                text={track.artist ?? ""}
                            />

                            <ProgressBar
                                trackLength={track.duration ?? 0}
                                currentTime={this.state.position}
                                onSeek={time => TrackPlayer.seekTo(time)}
                                onSlidingStart={() => null}
                            />

                            <Controls
                                isPaused={this.state.paused}
                                shuffleRepeatControl={() => shuffleQueue()}
                                skipToPreviousControl={() => TrackPlayer.skipToPrevious()}
                                playControl={async () => this.togglePlayback()}
                                skipToNextControl={() => TrackPlayer.skipToNext()}
                                makeFavoriteControl={() => null} />
                        </View>
                    </View>
                </JumpInView>
            )
        : null;
    }
}

export default PlayingTrackPage;
