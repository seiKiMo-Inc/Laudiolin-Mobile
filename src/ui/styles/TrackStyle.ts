import { Dimensions, StyleSheet } from "react-native";

const dimensions = Dimensions.get("window");
const screenWidth = dimensions.width;

export const TrackStyle = StyleSheet.create({
    container: {

    },
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
        width: screenWidth - 160
    },
    artist: {
        fontSize: 12
    },
    more: {
        zIndex: 1,
        position: "absolute",
        right: 0,
        alignSelf: "center",
        justifyContent: "center",
    }
});

export const ControlStyle = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginLeft: 20,
        zIndex: 10000,
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
        zIndex: 10,
        marginRight: 10,
        gap: 10
    },
    button: {
        fontSize: 45,
    },
    info: {
        width: Dimensions.get("window").width - 40,
        position: "absolute",
        right: -20,
        justifyContent: "center",
    }
});
