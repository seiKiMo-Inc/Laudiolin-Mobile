import { Dimensions, StyleSheet } from "react-native";

export const TrackStyle = StyleSheet.create({
    image: {
        width: 64, height: 64,
        borderRadius: 12
    },
    text: {
        paddingLeft: 15,
        justifyContent: "center"
    },
    title: {
        color: "white",
        fontFamily: "Poppins",
        fontSize: 16,
        width: 270
    },
    artist: {
        fontSize: 12
    },
    more: {
        justifyContent: "center"
    }
});

export const ControlStyle = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingLeft: 20
    },
    image: {
        height: 60,
        width: Dimensions.get("window").width - 38,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 2.5
    },
    controls: {
        flexDirection: "row",
        position: "absolute",
        right: "5%",
    },
    button: {
        fontSize: 45,
        paddingRight: 20
    },
    info: {
        width: Dimensions.get("window").width - 40,
        position: "absolute",
        right: -20,
        justifyContent: "center",
    }
});
