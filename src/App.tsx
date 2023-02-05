import React from "react";
import { StyleSheet, View, BackHandler } from "react-native";

import { TabView } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";

import Home from "@pages/Home";
import SearchPage from "@pages/SearchPage";
import LoginPage from "@pages/LoginPage";
import SettingsPage from "@pages/SettingsPage";
import PlaylistsPage from "@pages/PlaylistsPage";
import PlayingTrackPage from "@pages/PlayingTrackPage";
import PlaylistPage from "@pages/PlaylistPage";
import DownloadsPage from "@pages/DownloadsPage";

import NavBar from "@components/NavBar";
import QuickControl from "@components/player/QuickControl";

import * as user from "@backend/user";
import emitter from "@backend/events";
import { registerListener } from "@backend/navigation";
import { MenuProvider } from "react-native-popup-menu";

interface IState {
    pageIndex: number;
    loggedIn: boolean;

    showPlayingTrackPage: boolean;
    showPlaylistsPage: boolean;
    showPlaylistPage: boolean;
    showDownloadPage: boolean;
    isQuickControlVisible: boolean;
}

const style = StyleSheet.create({
    control: {
        position: "absolute",
        bottom: "8%",
    }
});

class App extends React.Component<any, IState> {
    onLogin = () => this.setState({ loggedIn: true });

    constructor(props: any) {
        super(props);

        this.state = {
            pageIndex: 0,
            loggedIn: user.userData != null,

            showPlayingTrackPage: false,
            showPlaylistsPage: false,
            showPlaylistPage: false,
            showDownloadPage: false,

            isQuickControlVisible: false
        };
    }

    async componentDidMount() {
        // Listen for the login event.
        emitter.on("login", this.onLogin);

        // Login to laudiolin.
        await user.login();

        registerListener(page => {
            switch (page) {
                default:
                    return;
                case "Home":
                    this.setState({
                        pageIndex: 0,
                        loggedIn: true,
                        showPlayingTrackPage: false,
                        showPlaylistsPage: false,
                        showPlaylistPage: false,
                        showDownloadPage: false
                    });
                    return;
                case "Login":
                    this.setState({
                        pageIndex: 0,
                        loggedIn: false,
                        showPlayingTrackPage: false,
                        showPlaylistsPage: false,
                        showPlaylistPage: false,
                        showDownloadPage: false
                    });
                    return;
                case "Playlist":
                    this.setState({
                        pageIndex: 0,
                        showPlayingTrackPage: false,
                        showPlaylistsPage: false,
                        showPlaylistPage: true,
                        showDownloadPage: false
                    });
                    return;
                case "Playing":
                    this.setState({
                        pageIndex: 0,
                        showPlayingTrackPage: true,
                        showPlaylistsPage: false,
                        showPlaylistPage: false,
                        showDownloadPage: false
                    });
                    return;
                case "Playlists":
                    this.setState({
                        pageIndex: 0,
                        showPlayingTrackPage: false,
                        showPlaylistsPage: true,
                        showPlaylistPage: false,
                        showDownloadPage: false
                    });
                    return;
                case "Downloads":
                    this.setState({
                        pageIndex: 0,
                        showPlayingTrackPage: false,
                        showPlaylistsPage: false,
                        showPlaylistPage: false,
                        showDownloadPage: true
                    });
                    return;
            }
        });

        BackHandler.addEventListener("hardwareBackPress", () => {
            if (this.state.showPlaylistPage) {
                this.setState({ showPlaylistPage: false });
                return true;
            }

            if (this.state.showPlaylistsPage) {
                this.setState({ showPlaylistsPage: false });
                return true;
            }

            if (this.state.showPlayingTrackPage) {
                this.setState({ showPlayingTrackPage: false });
                return true;
            }

            if (this.state.showDownloadPage) {
                this.setState({ showDownloadPage: false });
                return true;
            }

            BackHandler.exitApp();
            return true;
        });
    }

    componentWillUnmount() {
        emitter.removeListener("login", this.onLogin);
    }

    render() {
        return this.state.loggedIn ? (
            <MenuProvider>
                <TabView
                    value={this.state.pageIndex}
                    onChange={(i) => this.setState({ pageIndex: i })}
                    animationType="timing"
                    animationConfig={{ useNativeDriver: true, bounciness: 0, duration: 100 }}
                    disableSwipe={true}
                    containerStyle={{ backgroundColor: "#0c0f17" }}
                >
                    <TabView.Item>
                        <Home />
                    </TabView.Item>
                    <TabView.Item>
                        <SearchPage />
                    </TabView.Item>
                    <TabView.Item>
                        <></>
                    </TabView.Item>
                    <TabView.Item>
                        <SettingsPage />
                    </TabView.Item>
                </TabView>

                <View style={{ width: "100%", height: this.state.isQuickControlVisible ? 130 : 50, backgroundColor: "#0c0f17", zIndex: 0 }} />
                <LinearGradient
                    colors={["transparent", "#1f2442"]}
                    style={{ position: "absolute", bottom: 0, width: "100%", height: 50 }}
                    locations={[0, 0.9]}
                />
                <NavBar pageIndex={this.state.pageIndex} setPageIndex={(i) => this.setState({ pageIndex: i })} />

                <PlayingTrackPage showPage={this.state.showPlayingTrackPage} />
                <PlaylistsPage showPage={this.state.showPlaylistsPage} />
                <PlaylistPage showPage={this.state.showPlaylistPage} />
                <DownloadsPage showPage={this.state.showDownloadPage} />

                <View style={style.control}>
                    <QuickControl
                        showPlayingTrackPage={() => this.setState({ showPlayingTrackPage: true })}
                        isQuickControlVisible={(visible) => this.setState({ isQuickControlVisible: visible })}
                    />
                </View>
            </MenuProvider>
        ) : (
            <>
                <LoginPage />
            </>
        )
    }
}

export default App;
