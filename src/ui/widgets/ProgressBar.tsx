import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { color, Slider } from "@rneui/base";

import StyledText, { Size } from "@components/StyledText";
import TrackPlayer from "react-native-track-player";
import { colors } from "@style/Laudiolin";

/**
 * Formats a time in seconds into HH:mm:ss
 *
 * @param time Time in seconds.
 */
function formatTime(time: number): string {
    time = Math.floor(time);

    let seconds: string | number = Math.floor(time % 60);
    let minutes: string | number = Math.floor((time / 60) % 60);

    if (minutes <= 0) {
        minutes = "00";
    }
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

interface IProps {
    progress: number;
    duration: number;

    style?: StyleProp<ViewStyle> | any;
}

function ProgressBar(props: IProps) {
    return (
        <View style={{
            ...style.ProgressBar,
            ...props.style
        }}>
            <Slider
                value={props.progress} allowTouchTrack
                minimumValue={0} maximumValue={props.duration} step={1}
                onValueChange={value => TrackPlayer.seekTo(value)}
                onSlidingStart={() => TrackPlayer.pause()}
                onSlidingComplete={() => TrackPlayer.play()}
                thumbStyle={style.ProgressBar_Thumb}
                trackStyle={{ height: 2 }}
                style={{ height: 12 }}
                minimumTrackTintColor={"white"}
                maximumTrackTintColor={colors.secondary}
            />

            <View style={style.ProgressBar_Time}>
                <StyledText text={formatTime(props.progress)}
                            size={Size.Footnote} style={style.ProgressBar_Text} />
                <StyledText text={formatTime(props.duration)}
                            size={Size.Footnote} style={style.ProgressBar_Text} />
            </View>
        </View>
    );
}

export default ProgressBar;

const style = StyleSheet.create({
    ProgressBar: {
        flexDirection: "column"
    },
    ProgressBar_Text: {
        color: "gray"
    },
    ProgressBar_Time: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    ProgressBar_Thumb: {
        backgroundColor: "white",
        width: 12, height: 12
    }
});
