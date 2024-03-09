import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import TextTicker from "react-native-text-ticker";

const base = {
    color: "#ffffff"
} as StyleSheet.NamedStyles<any>;

export enum Size {
    Text = 16,
    Footnote = 12,
    Header = 24,
    Subheader = 20,
    Title = 32,
    Subtitle = 28
}

interface IProps {
    text: string;
    lines?: number;
    size?: Size | number;

    bold?: boolean;
    ticker?: boolean;
    underlined?: boolean;

    style?: StyleProp<TextStyle> | any;
    onPress?: () => void;
}

function StyledText(props: IProps) {
    const style = {
        ...base,
        fontFamily: `Poppins_${props.bold ? "700Bold" : "400Regular"}`,
        textDecorationLine: props.underlined ? "underline" : "none",
        fontSize: props.size || Size.Text,
        ...props.style
    };

    return !props.ticker ? (
        <Text
            style={style}
            ellipsizeMode={"tail"}
            numberOfLines={props.lines ?? 1}
            onPress={props.onPress}
        >
            {props.text}
        </Text>
    ) : (
        <TextTicker
            style={style}
            ellipsizeMode={"tail"}
            numberOfLines={props.lines ?? 1}
            onPress={props.onPress}
            duration={100 * props.text.length}
            loop
            bounce
        >
            {props.text}
        </TextTicker>
    );
}

export default StyledText;
