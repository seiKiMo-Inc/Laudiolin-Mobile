import { StyleProp, ViewStyle } from "react-native";

import { Button } from "@rneui/themed";
import { IconNode } from "@rneui/base";

interface IProps {
    text: string;
    icon?: IconNode;

    style?: StyleProp<ViewStyle>;

    onPress?: () => void;
}

function StyledButton(props: IProps) {
    return (
        <Button
            title={props.text}
            icon={props.icon}
            style={props.style}
            onPress={props.onPress}
        />
    );
}

export default StyledButton;
