import React from "react";
import { View } from "react-native";

import { Icon } from "@rneui/themed";

import { isListeningWith } from "@backend/social";

import { RepeatMode } from "react-native-track-player/lib/interfaces";

interface IProps {
    isPaused: boolean;

    shuffleControl: () => void;
    repeatControl: () => void;
    skipToPreviousControl: () => void;
    playControl: () => void;
    skipToNextControl: () => void;

    repeatMode: RepeatMode;
}

class Controls extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30, alignItems: "center" }}>
                <Icon
                    name={"shuffle"}
                    type={"material"}
                    size={30}
                    color={isListeningWith() ? "#D0D0D0FF" : "#FFFFFF"}
                    underlayColor={"#FFFFFF"}
                    onPress={() => !isListeningWith() && this.props.shuffleControl()}
                />

                <Icon
                    name={"skip-previous"}
                    type={"material"}
                    size={30}
                    color={isListeningWith() ? "#D0D0D0FF" : "#FFFFFF"}
                    underlayColor={"#FFFFFF"}
                    onPress={() => !isListeningWith() && this.props.skipToPreviousControl()}
                />

                <Icon
                    name={this.props.isPaused ? "play-arrow" : "pause"}
                    type={"material"}
                    size={30}
                    color={isListeningWith() ? "#D0D0D0FF" : "#FFFFFF"}
                    containerStyle={{ backgroundColor: "#FFFFFF50", borderRadius: 50, padding: 10 }}
                    underlayColor={"#FFFFFF"}
                    onPress={() => !isListeningWith() && this.props.playControl()}
                />

                <Icon
                    name={"skip-next"}
                    type={"material"}
                    size={30}
                    color={isListeningWith() ? "#D0D0D0FF" : "#FFFFFF"}
                    underlayColor={"#FFFFFF"}
                    onPress={() => !isListeningWith() && this.props.skipToNextControl()}
                />

                <Icon
                    name={this.props.repeatMode === RepeatMode.Track ? "repeat-one" : "repeat"}
                    type={"material"}
                    size={30}
                    color={this.props.repeatMode === RepeatMode.Off ?
                        (isListeningWith() ? "#D0D0D0FF" : "#FFFFFF") : "#00dfff"}
                    underlayColor={"#FFFFFF"}
                    onPress={() => !isListeningWith() && this.props.repeatControl()}
                />
            </View>
        );
    }
}

export default Controls;
