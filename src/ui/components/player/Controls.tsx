import React from "react";
import { View } from "react-native";

import { Icon } from "@rneui/themed";

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


class Controls extends React.Component<IProps, any> {
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
                    color={"#FFFFFF"}
                    underlayColor={"#FFFFFF"}
                    onPress={this.props.shuffleControl}
                    onLongPress={this.props.repeatControl}
                />

                <Icon
                    name={"skip-previous"}
                    type={"material"}
                    size={30}
                    color={"#FFFFFF"}
                    underlayColor={"#FFFFFF"}
                    onPress={this.props.skipToPreviousControl}
                />

                <Icon
                    name={this.props.isPaused ? "play-arrow" : "pause"}
                    type={"material"}
                    size={30}
                    color={"#FFFFFF"}
                    containerStyle={{ backgroundColor: "#FFFFFF50", borderRadius: 50, padding: 10 }}
                    underlayColor={"#FFFFFF"}
                    onPress={this.props.playControl}
                />

                <Icon
                    name={"skip-next"}
                    type={"material"}
                    size={30}
                    color={"#FFFFFF"}
                    underlayColor={"#FFFFFF"}
                    onPress={this.props.skipToNextControl}
                />

                <Icon
                    name={this.props.repeatMode === RepeatMode.Track ? "repeat-one" : "repeat"}
                    type={"material"}
                    size={30}
                    color={this.props.repeatMode === RepeatMode.Off ? "#FFFFFF" : "#00dfff"}
                    underlayColor={"#FFFFFF"}
                    onPress={this.props.repeatControl}
                />
            </View>
        );
    }
}

export default Controls;
