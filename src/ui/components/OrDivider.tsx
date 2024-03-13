import { StyleSheet, View } from "react-native";

import StyledText, { Size } from "@components/StyledText";

function OrDivider() {
    return (
        <View style={style.Divider}>
            <View style={{ borderBottomWidth: 1, borderColor: "white", width: "45%" }} />
            <StyledText text={"OR"} size={Size.Footnote} />
            <View style={{ borderBottomWidth: 1, borderColor: "white", width: "45%" }} />
        </View>
    );
}

export default OrDivider;

const style = StyleSheet.create({
    Divider: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    }
});
