import { Dimensions, StyleSheet } from "react-native";

export const LoginPageStyle = StyleSheet.create({
    top: {
        backgroundColor: "#0c0f17",
        width: "100%",

        alignItems: "center",
        justifyContent: "flex-end",

        flex: 4
    },
    bottom: {
        backgroundColor: "#0c0f17",
        width: "100%",

        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 20,

        flex: 4
    },
    image: {
        bottom: 0,
        width: 448, height: 448,
        position: "absolute",
        alignSelf: "center",
        opacity: 0.3
    }
});

export const SettingsPageStyle = StyleSheet.create({
    container: {
        paddingLeft: 20
    },
    title: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold",

        paddingTop: 40,
        paddingBottom: 20
    },
    userContainer: {
        flexDirection: "row",
    },
    userImage: {
        width: 48, height: 48,
        borderRadius: 24
    },
    userText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    logOut: {
        fontSize: 13,
        textDecorationLine: "underline",
        paddingLeft: "48%"
    },
    settingsContainer: {
        paddingTop: 30
    },
    category: {
        fontSize: 20,
        fontWeight: "bold",

        paddingBottom: 30
    },
    configure: {
        paddingBottom: 30
    },
    setting: {
        fontSize: 18,
        fontWeight: "400"
    },
    value: {
        color: "#64676b"
    }
});

export const SearchPageStyle = StyleSheet.create({
    container: {
        paddingTop: 40,
        width: Dimensions.get("window").width,
    },
    searchText: {
        color: "white",
    },
    searchContainer: {
        width: "90%",
        height: 45,
        borderColor: "white",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 10
    },
    results: {
        paddingTop: 30,
        paddingLeft: 20,
        flexDirection: "row"
    },
    resultImage: {
        width: 64, height: 64,
        borderRadius: 12
    },
    resultText: {
        paddingLeft: 15,
        justifyContent: "center"
    },
    resultTitle: {
        color: "white",
        fontFamily: "Poppins",
        fontSize: 16,
        width: 270
    },
    resultArtist: {
        fontSize: 12
    },
    resultsMore: {
        justifyContent: "center"
    }
});

export const PlayingTrackPageStyle = StyleSheet.create({
   view: {
       width: "100%",
       height: "100%",
       backgroundColor: "#000000",
       zIndex: 99999,
       position: "absolute",
       top: 0,
       left: 0,
       alignItems: "center",
       justifyContent: "center"
   }
});
