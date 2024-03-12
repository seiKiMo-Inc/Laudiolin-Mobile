import { Dimensions, StyleSheet } from "react-native";

export const colors = {
    primary: "#0c0f17",
    secondary: "#1b273a",
    accent: "#4e7abe",
    contrast: "#6d90ca",
    red: "#d21d4f",
    gray: "#888787"
};

export const value = {
    padding: 15,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
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
