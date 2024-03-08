import { StyleSheet, Text } from "react-native";

const base = {
    color: "#ffffff"
} as StyleSheet.NamedStyles<any>;

export enum Size {
    Text = 16,
    Footnote = 12,
    Header = 24,
    Subheader = 20,
    Title = 32
}

interface IProps {
    text: string;
    bold?: boolean;
    size?: Size | number;

    style?: StyleSheet | any;
}

function StyledText(props: IProps) {
    return (
        <Text
            style={{
                ...base,
                fontFamily: `Poppins_${props.bold ? "700Bold" : "400Regular"}`,
                fontSize: props.size || Size.Text,
                ...props.style
            }}
        >
            {props.text}
        </Text>
    );
}

export default StyledText;
