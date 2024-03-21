import { StyleSheet, TouchableOpacity, View } from "react-native";

import AdIcon from "react-native-vector-icons/AntDesign";

import StyledText from "@components/StyledText";

import { useColor } from "@backend/stores";

interface IProps {
    onPress?: () => void;
}

function ImportButton({ onPress }: IProps) {
    const colors = useColor();

    return (
        <TouchableOpacity
            style={style.ImportButton}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={{
                ...style.ImportButton_Button,
                backgroundColor: colors.accent
            }}>
                <AdIcon name={"pluscircleo"} size={42} color={colors.text} />
            </View>

            <StyledText text={"Import a Track"} />
        </TouchableOpacity>
    );
}

export default ImportButton;

const style = StyleSheet.create({
    ImportButton: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    ImportButton_Button: {
        width: 64,
        height: 64,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    }
});
