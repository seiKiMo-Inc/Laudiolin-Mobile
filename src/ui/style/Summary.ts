import { StyleSheet } from "react-native";

export default StyleSheet.create({
    Summary: {
        flexGrow: 0,
        flexShrink: 0,
        width: "100%",
        gap: 35,
        padding: 15,
        paddingTop: 25,
        overflow: "scroll"
    },
    Summary_Header: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    Summary_Block: {
        gap: 15
    },
    Summary_Playlist: {
        gap: 15
    },
    Summary_TrackList: {
        gap: 15
    }
});
