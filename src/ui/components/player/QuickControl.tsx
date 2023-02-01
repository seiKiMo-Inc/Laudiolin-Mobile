import React from "react";
import { Dimensions, View } from "react-native";

import { Icon, Image } from "@rneui/base";
import BasicText from "@components/common/BasicText";

import { ControlStyle } from "@styles/TrackStyle";

import { getCurrentTrack } from "@app/backend/audio";
import TrackPlayer, { Event, State, Track } from "react-native-track-player";

interface IState {
    paused: boolean;
    track: Track|null;
}

class QuickControl extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            paused: false,
            track: null
        };
        
        // Register track player listeners.
        TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, () => this.forceUpdate());
        TrackPlayer.addEventListener(Event.PlaybackTrackChanged, () => this.forceUpdate());
        TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => this.forceUpdate());
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
    }
    
    /**
     * Skips to the next track in queue.
     */
    async skip(): Promise<void> {
        await TrackPlayer.skipToNext();
    }
    
    async componentDidMount(): Promise<void> {
        this.setState({ track: await getCurrentTrack() });
    }

    render() {
        const track = this.state.track;
        const toggle = this.state.paused ? "play-arrow" : "pause";

        return (
            <View style={ControlStyle.container}>
                <View style={{ justifyContent: "center" }}>
                    <View style={{
                        height: 65,
                        width: Dimensions.get("window").width - 33 - 100,
                        position: "absolute",
                        borderColor: "#1e85ad",
                        borderRadius: 20,
                        borderWidth: 5
                    }} />

                    <Image
                        source={{ uri: (track?.artwork as string ?? "") }}
                        style={ControlStyle.image}
                    >
                        <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", height: "100%", width: "100%", borderRadius: 20 }} />
                    </Image>
                </View>

                <View style={{ justifyContent: "center" }}>
                    <View style={ControlStyle.controls}>
                        <Icon
                            color={"white"}
                            type={"material"} name={toggle}
                            iconStyle={ControlStyle.button}
                            onPress={this.togglePlayback}
                        />

                        <Icon
                            color={"white"}
                            type={"material"} name={"skip-next"}
                            iconStyle={ControlStyle.button}
                            onPress={this.skip}
                        />
                    </View>

                    <View style={ControlStyle.info}>
                        <BasicText
                            text={track?.title ?? ""}
                            numberOfLines={1}
                            style={{ fontSize: 17 }}
                            width={Dimensions.get("window").width - 220}
                        />
                        <BasicText
                            text={track?.artist ?? ""}
                            style={{ fontSize: 14 }}
                            numberOfLines={1}
                            width={Dimensions.get("window").width - 220}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export default QuickControl;
