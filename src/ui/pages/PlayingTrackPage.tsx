import React from "react";
import { View, ImageBackground, ScrollView, Dimensions } from "react-native";
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { Icon, Image } from "@rneui/themed";
import Hide from "@components/common/Hide";
import BasicText from "@components/common/BasicText";
import JumpInView from "@components/common/JumpInView";
import ProgressBar from "@components/player/ProgressBar";
import Controls from "@components/player/Controls";

import TextTicker from "react-native-text-ticker";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { TrackMenuStyle } from "@styles/MenuStyle";
import { PlayingTrackPageStyle } from "@styles/PageStyles";

import type { Playlist } from "@backend/types";
import emitter from "@backend/events";
import { isOffline } from "@backend/offline";
import { currentPlaylist } from "@backend/playlist";
import { getIconUrl, openTrack, promptPlaylistTrackAdd } from "@app/utils";
import { navigate } from "@backend/navigation";
import { isListeningWith } from "@backend/social";
import { favoriteTrack, favorites } from "@backend/user";
import { getCurrentTrack, shuffleQueue, asData,
    downloadTrack, toggleRepeatState, forcePause } from "@backend/audio";

import TrackPlayer, { Event, State, Track } from "react-native-track-player";
import { RepeatMode } from "react-native-track-player/lib/interfaces";
import { ScreenWidth } from "@rneui/base";

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
    imageWidth: number;
    imageHeight: number;
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
            repeatMode: RepeatMode.Off,
            imageWidth: 0,
            imageHeight: 0
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

    setImageSize() {
        let artwork = this.state.track?.artwork as string;
        if (!artwork) artwork = getIconUrl(asData(this.state.track as Track));

        const { width, height } = Dimensions.get("window");

        Image.getSize(artwork as string, (w, h) => {
            if (width < height) {
                this.setState({
                    imageWidth: width * 0.9,
                    imageHeight: (width / (w / h)) * 0.9
                });
            } else {
                this.setState({
                    imageWidth: (height / (h / w)) * 0.9,
                    imageHeight: height * 0.9
                });
            }
        });
    }

    componentDidMount() {
        // Register track player listeners.
        TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, () => this.positionUpdate());
        TrackPlayer.addEventListener(Event.PlaybackTrackChanged, () => this.update());
        TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => this.update());
        TrackPlayer.addEventListener(Event.PlaybackState, () => this.update());
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (this.state.track != prevState.track) {
            this.setImageSize();
        }
    }

    render() {
        let { track } = this.state;
        if (!track) return null;

        // Get the track's artwork.
        let artwork = track.artwork as string;
        if (!artwork) artwork = getIconUrl(asData(track));

        return this.props.showPage ? (
                <JumpInView visible={this.props.showPage} style={PlayingTrackPageStyle.view}>
                    <ImageBackground
                        style={PlayingTrackPageStyle.background}
                        source={{ uri: artwork }}
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

                        <Menu>
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
                                                text={"Add to Playlist"} onSelect={() => promptPlaylistTrackAdd(asData(track!))} />}

                                <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                            text={"Open Track Source"} onSelect={() => openTrack(track!)} />
                                <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                            text={"Download Track"} onSelect={() => downloadTrack(asData(track!))} />
                            </MenuOptions>
                        </Menu>
                    </View>
                    <ParallaxScrollView
                        showsVerticalScrollIndicator={false}
                        backgroundColor="#00000000"
                        contentBackgroundColor="#00000000"
                        parallaxHeaderHeight={ScreenWidth + 20}
                        renderForeground={() => (
                            <View style={PlayingTrackPageStyle.trackInfo}>
                                <View
                                    style={{
                                            opacity: 0,
                                            width: ScreenWidth,
                                            height: 80
                                            }}
                                />
                                <Image
                                    style={{
                                            ...PlayingTrackPageStyle.trackImage,
                                            width: this.state.imageWidth,
                                            height: this.state.imageHeight
                                            }}
                                    source={{ uri: artwork }}
                                />
                            </View>
                        )}>
                        <View style={PlayingTrackPageStyle.middleContainer}>
                            <View>
                                <View style={PlayingTrackPageStyle.title}>
                                    <TextTicker
                                        style={{ color: "#FFFFFF", fontSize: 25 }}
                                        loop duration={5000}
                                    >
                                        {track.title ?? ""}
                                    </TextTicker>
                                </View>

                                <BasicText
                                    style={{ color: "#a1a1a1", fontSize: 15 }}
                                    text={track.artist ?? ""}
                                    containerStyle={PlayingTrackPageStyle.title}
                                />
                            </View>

                            <Hide show={!isOffline}>
                                <Icon
                                    name={"favorite"}
                                    type={"material"}
                                    size={30}
                                    color={this.state.favorite ? "#d21d4f" : "#FFFFFF"}
                                    underlayColor={"#FFFFFF"}
                                    onPress={() => this.favoriteTrack()}
                                />
                            </Hide>
                        </View>

                        <View style={PlayingTrackPageStyle.lowerContainer}>
                            <ProgressBar
                                canSeek={!isListeningWith()}
                                trackLength={track.duration ?? 0}
                                currentTime={this.state.position}
                                onSeek={time => {
                                    TrackPlayer.seekTo(time)
                                        .then(() => emitter.emit("seek", time));
                                }}
                                onSlidingStart={() => null}
                            />

                            <Controls
                                isPaused={this.state.paused || forcePause}
                                shuffleControl={() => shuffleQueue()}
                                repeatControl={() => this.toggleReplayState()}
                                skipToPreviousControl={() => this.skip(true)}
                                playControl={async () => this.togglePlayback()}
                                skipToNextControl={() => this.skip(false)}
                                repeatMode={this.state.repeatMode}
                            />
                        </View>
                    </ParallaxScrollView>
                </JumpInView>
            )
        : null;
    }
}

export default PlayingTrackPage;