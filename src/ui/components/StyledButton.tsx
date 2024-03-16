import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { Button } from "@rneui/themed";
import { IconNode } from "@rneui/base";

import { useColor } from "@backend/stores";

interface IProps {
    text: string;
    icon?: IconNode;
    disabled?: boolean;

    style?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle> | any;
    disabledStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;

    onPress?: () => void;
    onHold?: () => void;
}

function StyledButton(props: IProps) {
    const colors = useColor();

    return (
        <Button
            disabled={props.disabled}
            title={props.text}
            icon={props.icon}
            titleStyle={{
                color: colors.text,
                ...props.titleStyle
            }}
            buttonStyle={props.buttonStyle}
            disabledStyle={props.disabledStyle}
            containerStyle={props.style}
            activeOpacity={0.7}
            onPress={props.onPress}
            onLongPress={props.onHold}
        />
    );
}

export default StyledButton;
