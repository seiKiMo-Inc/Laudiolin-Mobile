import { StyleSheet } from "react-native";

import { value } from "@style/Laudiolin";

export default StyleSheet.create({
    Track: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    Track_Container: {
        flexDirection: "row",
        gap: 12
    },
    Track_Icon: {
        width: 64,
        height: 64,
        borderRadius: 10
    },
    Track_Info: {
        flexDirection: "column",
        alignSelf: "center"
    },
    Track_Title: {
        width: value.width - 140
    },
    Track_ContextMenu: {
        color: "white",
        alignSelf: "center"
    }
});
