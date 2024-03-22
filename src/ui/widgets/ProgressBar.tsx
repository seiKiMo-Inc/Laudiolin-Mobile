import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import TrackPlayer from "react-native-track-player";

import { Slider } from "@rneui/base";

import StyledText, { Size } from "@components/StyledText";

import Gateway from "@backend/gateway";
import { useColor } from "@backend/stores";

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
    const colors = useColor();

    return (
        <View style={{
            ...style.ProgressBar,
            ...props.style
        }}>
            <Slider
                value={props.progress} allowTouchTrack
                minimumValue={0} maximumValue={props.duration} step={1}
                onValueChange={async value => {
                    await TrackPlayer.seekTo(value);
                    await Gateway.update({ isSeek: true });
                }}
                onSlidingStart={() => TrackPlayer.pause()}
                onSlidingComplete={() => TrackPlayer.play()}
                thumbStyle={{
                    width: 12, height: 12,
                    backgroundColor: colors.text
                }}
                trackStyle={{ height: 2 }}
                style={{ height: 12 }}
                minimumTrackTintColor={colors.text}
                maximumTrackTintColor={colors.secondary}
            />

            <View style={style.ProgressBar_Time}>
                <StyledText text={formatTime(props.progress)}
                            size={Size.Footnote} style={{ color: colors.gray }} />
                <StyledText text={formatTime(props.duration)}
                            size={Size.Footnote} style={{ color: colors.gray }} />
            </View>
        </View>
    );
}

export default ProgressBar;

const style = StyleSheet.create({
    ProgressBar: {
        flexDirection: "column"
    },
    ProgressBar_Time: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
});
