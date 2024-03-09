import { ColorValue, StyleProp, TextStyle, ViewStyle } from "react-native";

import { IconNode, Input } from "@rneui/base";

interface IProps {
    default: string;
    icon?: IconNode;

    defaultColor?: ColorValue;
    maxLength?: number;

    textStyle?: StyleProp<TextStyle> | any;
    inputStyle?: StyleProp<ViewStyle> | any;
    containerStyle?: StyleProp<ViewStyle> | any;

    onChange?: (text: string) => void;
}

function StyledTextInput(props: IProps) {
    return (
        <Input
            placeholder={props.default}
            placeholderTextColor={props.defaultColor}
            rightIcon={props.icon}
            inputStyle={{
                ...props.textStyle,
                color: "white"
            }}
            inputContainerStyle={props.inputStyle}
            containerStyle={props.containerStyle}
            onChangeText={props.onChange}
        />
    );
}

export default StyledTextInput;
