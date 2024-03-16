import { StyleProp, ViewStyle } from "react-native";

import { Button } from "@rneui/themed";
import { IconNode } from "@rneui/base";

interface IProps {
    text: string;
    icon?: IconNode;
    disabled?: boolean;

    style?: StyleProp<ViewStyle>;
    disabledStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;

    onPress?: () => void;
    onHold?: () => void;
}

function StyledButton(props: IProps) {
    return (
        <Button
            disabled={props.disabled}
            title={props.text}
            icon={props.icon}
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
