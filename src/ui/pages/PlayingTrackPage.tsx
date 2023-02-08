import React from "react";
import { View, ImageBackground, ScrollView } from "react-native";

import { Icon, Image } from "@rneui/themed";
import Hide from "@components/common/Hide";
import BasicText from "@components/common/BasicText";
import JumpInView from "@components/common/JumpInView";
import ProgressBar from "@components/player/ProgressBar";
import Controls from "@components/player/Controls";

import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { TrackMenuStyle } from "@styles/MenuStyle";
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
    repeatMode: RepeatMode;
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
            repeatMode: RepeatMode.Off
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
        switch (await TrackPlayer.getRepeatMode()) {
            case RepeatMode.Off:
                this.setState({ repeatMode: RepeatMode.Off });
                break;
            case RepeatMode.Queue:
                this.setState({ repeatMode: RepeatMode.Queue });
                break;
            case RepeatMode.Track:
                this.setState({ repeatMode: RepeatMode.Track });
                break;
        }
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

                            <MenuOptions customStyles={{ optionsContainer: TrackMenuStyle.menu }}>
                                {this.state.playlist == null &&
                                    <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                                text={"Add to Playlist"} onSelect={() => null} />}

                                <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                            text={"Open Track Source"} onSelect={() => openTrack(track!)} />
                                <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                            text={"Download Track"} onSelect={() => download(asData(track!))} />
                            </MenuOptions>
                        </Menu>
                    </View>

                    <ScrollView>
                        <View style={PlayingTrackPageStyle.trackInfo}>
                            <Image
                                style={PlayingTrackPageStyle.trackImage}
                                source={{ uri: track.artwork as string }}
                            />
                        </View>

                        <View style={PlayingTrackPageStyle.middleContainer}>
                            <View>
                                <BasicText
                                    style={{ color: "#FFFFFF", fontSize: 25 }}
                                    text={track.title ?? ""}
                                    containerStyle={PlayingTrackPageStyle.title}
                                />
                                <BasicText
                                    style={{ color: "#a1a1a1", fontSize: 15 }}
                                    text={track.artist ?? ""}
                                    containerStyle={PlayingTrackPageStyle.title}
                                />
                            </View>

                            <Icon
                                name={"favorite"}
                                type={"material"}
                                size={30}
                                color={this.state.favorite ? "#d21d4f" : "#FFFFFF"}
                                underlayColor={"#FFFFFF"}
                                onPress={() => this.favoriteTrack()}
                            />
                        </View>

                        <View style={PlayingTrackPageStyle.lowerContainer}>
                            <ProgressBar
                                trackLength={track.duration ?? 0}
                                currentTime={this.state.position}
                                onSeek={time => TrackPlayer.seekTo(time)}
                                onSlidingStart={() => null}
                            />

                            <Controls
                                isPaused={this.state.paused}
                                shuffleControl={() => shuffleQueue()}
                                repeatControl={() => this.toggleReplayState()}
                                skipToPreviousControl={() => this.skip(true)}
                                playControl={async () => this.togglePlayback()}
                                skipToNextControl={() => this.skip(false)}
                                repeatMode={this.state.repeatMode}
                            />
                        </View>
                    </ScrollView>
                </JumpInView>
            )
        : null;
    }
}

export default PlayingTrackPage;
