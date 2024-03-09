import { StyleSheet } from "react-native";

import { value } from "@style/Laudiolin";

export default StyleSheet.create({
    Search: {
        flexDirection: "column",
        padding: value.padding,
        gap: 15
    },
    Search_Input: {
        borderBottomWidth: 2,
        borderWidth: 2,

        borderRadius: 10,
        borderColor: "white",
        paddingLeft: 10,
        paddingRight: 10
    },
    Search_Results: {
        gap: 15
    }
});
