import React from "react";
import { View } from "react-native";

import { Icon } from "@rneui/themed";

interface IProps {
    shuffleRepeatControl: () => void;
    skipToPreviousControl: () => void;
    playControl: () => void;
    skipToNextControl: () => void;
    makeFavoriteControl: () => void;
}


class Controls extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
                <Icon
                    name={"shuffle"}
                    type={"material"}
                    size={30}
                    color={"#FFFFFF"}
                    underlayColor={"#FFFFFF"}
                    onPress={this.props.shuffleRepeatControl}
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
                    name={"play-arrow"}
                    type={"material"}
                    size={30}
                    color={"#FFFFFF"}
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
                    name={"favorite"}
                    type={"material"}
                    size={30}
                    color={"#FFFFFF"}
                    underlayColor={"#FFFFFF"}
                    onPress={this.props.makeFavoriteControl}
                />
            </View>
        );
    }
}

export default Controls;
