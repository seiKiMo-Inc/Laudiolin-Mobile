import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height;

export const LoginPageStyle = StyleSheet.create({
    container: {
        height: "100%",
        width: screenWidth,
        backgroundColor: "#0c0f17",
        alignItems: "center",
        justifyContent: "center",
        gap: 20
    },
    image: {
        bottom: 0,
        width: 448, height: 448,
        position: "absolute",
        alignSelf: "center",
        opacity: 0.3,
        zIndex: 0
    },
    authContainer: {
        alignSelf: "center",
        width: 256,
    }
});

export const HomePageStyle = StyleSheet.create({
    text: {
        width: screenWidth
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 20
    },
    headerText: {
        fontSize: 28,
        fontWeight: "bold",
        paddingLeft: 20
    },
    morePlaylists: {
        textDecorationLine: "underline",
        textAlign: "right",
        paddingRight: 20
    },
    moreDownloads: {
        textDecorationLine: "underline",
        textAlign: "right",
        paddingRight: 20
    },
    morePlays: {
        textDecorationLine: "underline",
        textAlign: "right",
        paddingRight: 20,
        paddingLeft: "44%"
    },
    playlists: {
        paddingLeft: 20,
        marginRight: 20,
        flexDirection: "row"
    },
    playlist: {
        paddingRight: 20,
    },
    playlistImage: {
        borderRadius: 20,
        opacity: 0.8
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
    },
    tracks: {
        paddingHorizontal: 20,
    }
});

export const SettingsPageStyle = StyleSheet.create({
    text: {
        paddingLeft: 20,
        width: screenWidth,
    },
    title: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold",

        paddingTop: 40,
        paddingBottom: 20
    },
    userContainer: {
        width: screenWidth,
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
    logOutContainer: {
        position: "absolute",
        top: 12,
        left: screenWidth - 90
    },
    logOut: {
        color: "#ff3c3c",
        fontSize: 13,
        textDecorationLine: "underline"
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
    },
    actionsContainer: {
        alignSelf: "center"
    }
});

export const SearchPageStyle = StyleSheet.create({
    container: {
        paddingTop: 60,
        width: screenWidth,
        height: screenHeight,
    },
    searchText: {
        color: "white",
    },
    searchContainer: {
        width: "90%",
        height: 46,
        borderColor: "#354ab2",
        borderStyle: "solid",
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: "#070f26",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    results: {
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
});

export const InformationPageStyle = StyleSheet.create({
    friendTabContainer: {
        padding: 10,
        width: screenWidth,
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
    },
    container: {
        height: "100%",
        width: screenWidth,
    },
    tab: {
        backgroundColor: "#081126",
        paddingTop: 30,
    }
});

export const PlaylistsPageStyle = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 30,
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
    playlist: {
        paddingBottom: 20,
        width: "100%"
    },
    playlistImage: {
        width: 96, height: 96,
        borderRadius: 20
    },
    playlistContent: {
        flexDirection: "row",
        borderRadius: 0,
        width: "100%",
    },
    playlistTitle: {
        fontSize: 17,
        fontWeight: "bold",

        width: screenWidth - 200,
        color: "white"
    },
    playlistAuthor: {
        fontSize: 16,
        maxWidth: screenWidth - 200,
    },
    playlistMore: {
        position: "absolute",
        right: 10,
        alignSelf: "center",
        width: 40, height: 40,
        justifyContent: "center",
        alignItems: "center",
    }
});

export const PlayingTrackPageStyle = StyleSheet.create({
    background: {
        width: screenWidth,
        height: "100%",
        position: "absolute",
        zIndex: 0,
        resizeMode: "cover",
    },
    view: {
        width: screenWidth,
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
        height: 90,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 30,
        alignItems: "center",
        zIndex: 2,
    },
    topBarText: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

    trackInfo: {
        marginTop: 20,
        marginBottom: 20,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        width: screenWidth - 40,
        height: screenWidth - 40,
        maxWidth: screenHeight > 667 ? 400 : 280,
        maxHeight: screenHeight > 667 ? 400 : 280,
    },
    trackImage: {
        resizeMode: "cover",
        flex: 1,
        width: "100%",
        height: "100%",
        borderRadius: 10,
        aspectRatio: 1,
    },
    alert: {
        alignSelf: "center"
    },
    title: {
        width: screenWidth - 100,
    },
    middleContainer: {
        padding: 25,
        paddingBottom: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    lowerContainer: {
        padding: 25,
        flexDirection: "column",
        gap: 10,
    }
});

export const PlaylistPageStyle = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 30,
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
        width: screenWidth
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
    playButton: {
        width: 90, height: 40,
        borderRadius: 10,
    },
    playText: {
        fontWeight: "bold",
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

export const DownloadPageStyle = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 30,
        backgroundColor: "#0c0f17",
        height: "100%",
        width: "100%",
        zIndex: 99999,
        position: "absolute",
        top: 0,
        left: 0,
    }
});
