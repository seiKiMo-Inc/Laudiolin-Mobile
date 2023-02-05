import React from "react";
import { View, ImageBackground } from "react-native";

import { Icon, Image } from "@rneui/themed";
import Hide from "@components/common/Hide";
import BasicText from "@components/common/BasicText";
import JumpInView from "@components/common/JumpInView";
import ProgressBar from "@components/player/ProgressBar";
import Controls from "@components/player/Controls";

import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { PlayingTrackPageStyle } from "@styles/PageStyles";

import { openTrack } from "@app/utils";
import { Playlist } from "@backend/types";
import { navigate } from "@backend/navigation";
import { currentPlaylist } from "@backend/playlist";
import { favoriteTrack, favorites } from "@backend/user";
import { getCurrentTrack, shuffleQueue, asData, download, toggleRepeatState } from "@backend/audio";

import TrackPlayer, { Event, State, Track } from "react-native-track-player";
import { RepeatMode } from "react-native-track-player/lib/interfaces";

interface IProps {
    showPage: boolean;
}

interface IState {
    track: Track|null;
    position: number;
    paused: boolean;
    favorite: boolean;
    playlist: Playlist|null;
    alert: string;
}

class PlayingTrackPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            track: null,
            position: 0,
            paused: false,
            favorite: false,
            playlist: null,
            alert: ""
        };
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
     * Changes the favorite state of the current track.
     */
    async favoriteTrack(): Promise<void> {
        const { track } = this.state;
        if (!track) return;

        // Toggle the favorite state.
        await favoriteTrack(asData(track), !this.state.favorite);
        this.setState({ favorite: !this.state.favorite });
    }

    /**
     * Skips to the next or previous track.
     * @param backwards Whether to skip backwards.
     */
    async skip(backwards: boolean): Promise<void> {
        // Skip to the next or previous track.
        if (backwards)
            await TrackPlayer.skipToPrevious();
        else await TrackPlayer.skipToNext();

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
            paused: await TrackPlayer.getState() == State.Paused,
            favorite: track ? favorites.find(t => t.id == track.id) != null : false,
            playlist: currentPlaylist
        });
    }

    async toggleReplayState() {
        await toggleRepeatState(); // Toggle the repeat state.

        // Create a message to alert the user.
        let message = "Repeat State: ";
        switch (await TrackPlayer.getRepeatMode()) {
            case RepeatMode.Off:
                message += "Off";
                break;
            case RepeatMode.Queue:
                message += "Queue";
                break;
            case RepeatMode.Track:
                message += "Track";
                break;
        }

        // Alert the user.
        this.setState({ alert: message });
        setTimeout(() => {
            this.setState({ alert: "" });
        }, 1000);
    }

    componentDidMount() {
        // Register track player listeners.
        TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, () => this.positionUpdate());
        TrackPlayer.addEventListener(Event.PlaybackTrackChanged, () => this.update());
        TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => this.update());
        TrackPlayer.addEventListener(Event.PlaybackState, () => this.update());
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

                        <Hide show={this.state.playlist != null}>
                            <View style={PlayingTrackPageStyle.topBarText}>
                                <BasicText
                                    text={"Playing From Playlist"}
                                    style={{ textTransform: "uppercase" }}
                                />
                                <BasicText
                                    text={this.state.playlist?.name ?? "Unknown"}
                                    style={{ fontWeight: "bold", color: "#FFFFFF" }}
                                />
                            </View>
                        </Hide>

                        <Menu style={{ justifyContent: "center" }}>
                            <MenuTrigger>
                                <Icon
                                    size={30}
                                    name={"more-vert"}
                                    type={"material"}
                                    color={"#FFFFFF"}
                                />
                            </MenuTrigger>

                            <MenuOptions>
                                {this.state.playlist == null &&
                                    <MenuOption text={"Add to Playlist"} onSelect={() => null} />}

                                <MenuOption text={"Open Track Source"} onSelect={() => openTrack(track!)} />
                                <MenuOption text={"Download Track"} onSelect={() => download(asData(track!))} />
                            </MenuOptions>
                        </Menu>
                    </View>

                    <View style={PlayingTrackPageStyle.trackInfo}>
                        <Image
                            style={PlayingTrackPageStyle.trackImage}
                            source={{ uri: track.artwork as string }}
                        />
                    </View>

                    <View style={PlayingTrackPageStyle.lowerContainer}>
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
                            isFavorite={this.state.favorite}
                            shuffleControl={() => shuffleQueue()}
                            repeatControl={() => this.toggleReplayState()}
                            skipToPreviousControl={() => this.skip(true)}
                            playControl={async () => this.togglePlayback()}
                            skipToNextControl={() => this.skip(false)}
                            makeFavoriteControl={() => this.favoriteTrack()} />

                        <BasicText
                            text={this.state.alert} style={PlayingTrackPageStyle.alert}
                        />
                    </View>
                </JumpInView>
            )
        : null;
    }
}

export default PlayingTrackPage;
