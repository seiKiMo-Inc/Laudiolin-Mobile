import { StyleSheet, Text } from "react-native";

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
    underlined?: boolean;

    style?: StyleSheet | any;
    onPress?: () => void;
}

function StyledText(props: IProps) {
    return (
        <Text
            style={{
                ...base,
                fontFamily: `Poppins_${props.bold ? "700Bold" : "400Regular"}`,
                textDecorationLine: props.underlined ? "underline" : "none",
                fontSize: props.size || Size.Text,
                ...props.style
            }}
            numberOfLines={props.lines ?? 1}
            onPress={props.onPress}
        >
            {props.text}
        </Text>
    );
}

export default StyledText;
