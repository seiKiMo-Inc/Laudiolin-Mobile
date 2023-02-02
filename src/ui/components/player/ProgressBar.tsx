import React from "react";
import { View, Text } from "react-native";

import { Slider } from "@rneui/themed";
import { ProgressBarStyle } from "@styles/ProgressBarStyle";

interface IProps {
    trackLength: number;
    currentTime: number;
    onSeek: (value: number) => void;
    onSlidingStart: () => void;
}

class ProgressBar extends React.Component<IProps, any> {
    constructor(props: any) {
        super(props);
    }

    toTime(duration: number) {
        let seconds: string|number = Math.floor((duration) % 60);
        let minutes: string|number = Math.floor((duration / (60)) % 60);

        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        return [minutes, seconds];
    }

    render() {
        const elapsed = this.toTime(this.props.currentTime);
        const duration = this.toTime(this.props.trackLength);

        return (
            <View>
                <Slider
                    maximumValue={Math.max(this.props.trackLength, 1, this.props.currentTime + 1)}
                    onSlidingStart={this.props.onSlidingStart}
                    onSlidingComplete={this.props.onSeek}
                    value={this.props.currentTime}
                    minimumTrackTintColor={"#FFFFFF"}
                    maximumTrackTintColor={"#343d6b"}
                    thumbStyle={ProgressBarStyle.thumb}
                    trackStyle={ProgressBarStyle.track}
                />

                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                    <Text style={ProgressBarStyle.text}>
                        {elapsed[0] + ":" + elapsed[1]}
                    </Text>

                    <View style={{ flex: 1 }} />

                    <Text style={ProgressBarStyle.text}>
                        {duration[0] + ":" + duration[1]}
                    </Text>
                </View>
            </View>
        );
    }
}

export default ProgressBar;
