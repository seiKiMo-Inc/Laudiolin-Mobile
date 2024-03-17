import { ReactElement } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

import { Overlay } from "@rneui/base";

import StyledText, { Size } from "@components/StyledText";

import { useColor } from "@backend/stores";

import { value } from "@style/Laudiolin";

interface IProps {
    visible: boolean;

    title?: string;
    children?: ReactElement | ReactElement[] | any | undefined;

    style?: StyleProp<ViewStyle> | any;
    overlayStyle?: StyleProp<ViewStyle>;

    onLayout?: () => void;
    onPressOutside?: () => void;
}

function StyledModal(props: IProps) {
    const colors = useColor();

    return (
        <Overlay
            isVisible={props.visible}
            style={props.overlayStyle}
            onLayout={props.onLayout}
            onBackdropPress={props.onPressOutside}
            overlayStyle={{ backgroundColor: "transparent" }}
        >
            <View style={{
                ...style.StyledModal,
                backgroundColor: colors.secondary,
                ...props.style
            }}>
                { props.title && <StyledText text={props.title} bold size={Size.Subheader} /> }
                { props.children }
            </View>
        </Overlay>
    );
}

export default StyledModal;

const style = StyleSheet.create({
    StyledModal: {
        borderRadius: 25,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        padding: value.padding
    }
});
