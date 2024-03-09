import { Dimensions, StyleSheet } from "react-native";

export const colors = {
    primary: "#0c0f17",
    accent: "#4e7abe"
};

export const value = {
    padding: 15,
    width: Dimensions.get("screen").width
};

export default StyleSheet.create({
    App: {
        height: "100%",
        backgroundColor: colors.primary,
    },
    App_TabBar: {
        backgroundColor: colors.primary
    },
    App_Scene: {
        backgroundColor: colors.primary
    }
});
