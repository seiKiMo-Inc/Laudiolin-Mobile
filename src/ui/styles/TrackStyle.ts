import { StyleSheet } from "react-native";

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
