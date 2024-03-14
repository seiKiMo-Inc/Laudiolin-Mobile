import { ColorValue, StyleProp, TextStyle, ViewStyle } from "react-native";

import { IconNode, Input } from "@rneui/base";

interface IProps {
    default?: string;
    value?: string;
    icon?: IconNode;

    autoFocus?: boolean;
    autoCorrect?: boolean;
    defaultColor?: ColorValue;
    maxLength?: number;
    lines?: number;

    textStyle?: StyleProp<TextStyle> | any;
    inputStyle?: StyleProp<ViewStyle> | any;
    containerStyle?: StyleProp<ViewStyle> | any;

    errorMessage?: string;

    onChange?: (text: string) => void;
    onFinish?: () => void;
}

function StyledTextInput(props: IProps) {
    return (
        <Input
            value={props.value}
            numberOfLines={props.lines}
            multiline={(props.lines ?? 1) > 1}
            placeholder={props.default}
            placeholderTextColor={props.defaultColor}
            rightIcon={props.icon}
            autoFocus={props.autoFocus}
            autoCorrect={props.autoCorrect}
            inputStyle={{ color: "white", ...props.textStyle }}
            inputContainerStyle={props.inputStyle}
            containerStyle={props.containerStyle}
            errorMessage={props.errorMessage}
            errorStyle={!props.errorMessage ? { display: "none" } : {}}
            onChangeText={props.onChange}
            onEndEditing={props.onFinish}
        />
    );
}

export default StyledTextInput;
