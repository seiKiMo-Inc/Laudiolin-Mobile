import { Dimensions, StyleSheet } from "react-native";

export const LoginPageStyle = StyleSheet.create({
    top: {
        backgroundColor: "#0c0f17",
        width: "100%",

        alignItems: "center",
        justifyContent: "flex-end",

        flex: 4,
        zIndex: 1
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
        opacity: 0.3,
        zIndex: 0
    }
});

export const HomePageStyle = StyleSheet.create({
    text: {
        paddingLeft: 20,
        paddingTop: 40,
        width: Dimensions.get("window").width,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        paddingBottom: 20
    },
    morePlaylists: {
        textDecorationLine: "underline",
        textAlign: "right",
        paddingRight: 20,
        paddingLeft: "58%"
    },
    moreDownloads: {
        textDecorationLine: "underline",
        textAlign: "right",
        paddingRight: 20,
        paddingLeft: "50%"
    },
    morePlays: {
        textDecorationLine: "underline",
        textAlign: "right",
        paddingRight: 20,
        paddingLeft: "44%"
    },
    playlists: {
        flexDirection: "row"
    },
    playlist: {
        paddingRight: 20,
    },
    playlistImage: {
        borderRadius: 20,
        opacity: 0.9
    },
    playlistName: {
        fontSize: 20,
        fontWeight: "bold"
    },
    playlistNameContainer: {
        position: "absolute",
        bottom: 0,
        padding: 10,
        alignSelf: "center",
    }
});

export const SettingsPageStyle = StyleSheet.create({
    text: {
        paddingLeft: 20,
        width: Dimensions.get("window").width,
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
        textAlign: "right",
        paddingLeft: "45%"
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
    }
});

export const PlaylistsPageStyle = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 0,
        backgroundColor: "#0c0f17",
        height: "100%",
        width: "100%",
        zIndex: 99999,
        position: "absolute",
        top: 0,
        left: 0,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    list: {
        paddingBottom: 80
    },
    playlist: {
        paddingBottom: 20,
        flexDirection: "row"
    },
    playlistImage: {
        width: 96, height: 96,
        borderRadius: 20
    },
    playlistContent: {
        flexDirection: "row",
        borderRadius: 21
    },
    playlistTitle: {
        fontSize: 17,
        fontWeight: "bold",
    },
    playlistAuthor: {
        fontSize: 16
    },
    playlistMore: {
        paddingLeft: 20,
        justifyContent: "center"
    }
});

export const PlayingTrackPageStyle = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 0,
    },
    view: {
        width: "100%",
        height: "100%",
        backgroundColor: "#0c0f17",
        zIndex: 99999,
        position: "absolute",
        top: 0,
        left: 0,
        flexDirection: "column",
    },
    topBar: {
        width: "100%",
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20
    },
    topBarText: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    trackInfo: {
        alignSelf: "center",
        marginTop: 20,
    },
    trackImage: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        maxHeight: 400,
        maxWidth: 400,
    },
});

export const PlaylistPageStyle = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 0,
        backgroundColor: "#0c0f17",
        height: "100%",
        width: "100%",
        zIndex: 99999,
        position: "absolute",
        top: 0,
        left: 0,
    },
    tracks: {
    },
    playlistIcon: {
        width: 135, height: 135,
        borderRadius: 20
    },
    info: {
        paddingBottom: 20,
        flexDirection: "row",
    },
    actions: {
        paddingBottom: 20,
        flexDirection: "row",
        width: Dimensions.get("window").width
    },
    text: {
        paddingLeft: 20,
        justifyContent: "center",

        flex: 1
    },
    playlistName: {
        fontSize: 28,
        fontWeight: "bold",
        flexWrap: "wrap"
    },
    playlistAuthor: {
        fontSize: 16
    },
    favoriteIcon: {
        color: "#d21d4f",
        fontSize: 35,
        paddingTop: 1
    },
    editButton: {
        width: 90, height: 40,
        borderRadius: 10,
    },
    editText: {
        fontWeight: "bold",
    },
    shuffleButton: {
        width: 100, height: 40,
        borderRadius: 10,
    },
    shuffleText: {
        fontWeight: "bold",
    }
});
