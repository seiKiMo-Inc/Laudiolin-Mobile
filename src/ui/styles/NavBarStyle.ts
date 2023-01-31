import { StyleSheet } from "react-native";

export const NavBarStyle = StyleSheet.create({
    container: {
        position: "absolute",
        zIndex: 10000,
        bottom: 0,
        width: "100%",
    },
    tab: {
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: "Poppins"
    }
});
