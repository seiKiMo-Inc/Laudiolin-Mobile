import React from "react";
import { BackHandler, StyleSheet, View } from "react-native";

import { TabView } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";

import Home from "@pages/Home";
import SearchPage from "@pages/SearchPage";
import LoginPage from "@pages/LoginPage";
import SettingsPage from "@pages/SettingsPage";
import PlaylistsPage from "@pages/PlaylistsPage";
import PlayingTrackPage from "@pages/PlayingTrackPage";
import PlaylistPage from "@pages/PlaylistPage";

import NavBar from "@components/NavBar";
import QuickControl from "@components/player/QuickControl";

import { registerListener } from "@backend/navigation";
import * as user from "@backend/user";
import emitter from "@backend/events";

interface IState {
    pageIndex: number;
    loggedIn: boolean;

    showPlayingTrackPage: boolean;
    showPlaylistsPage: boolean;
    showPlaylistPage: boolean;
    isQuickControlVisible: boolean;
}

const style = StyleSheet.create({
    control: {
        position: "absolute",
        bottom: "8%",
    }
});

class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            pageIndex: 0,
            loggedIn: user.userData != null,

            showPlayingTrackPage: false,
            showPlaylistsPage: false,
            showPlaylistPage: false,
            isQuickControlVisible: false
        };

        emitter.on("login", () =>
            this.setState({ loggedIn: true }));
    }

    async componentDidMount() {
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
                        showPlaylistPage: false
                    });
                    return;
                case "Login":
                    this.setState({
                        pageIndex: 0,
                        loggedIn: false,
                        showPlayingTrackPage: false,
                        showPlaylistsPage: false,
                        showPlaylistPage: false
                    });
                    return;
                case "Playlist":
                    this.setState({
                        pageIndex: 0,
                        showPlayingTrackPage: false,
                        showPlaylistsPage: false,
                        showPlaylistPage: true
                    });
                    return;
                case "Playlists":
                    this.setState({
                        pageIndex: 0,
                        showPlayingTrackPage: false,
                        showPlaylistsPage: true,
                        showPlaylistPage: false
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

            return false;
        });
    }

    render() {
        return this.state.loggedIn ? (
            <>
                <TabView
                    value={this.state.pageIndex}
                    onChange={(i) => this.setState({ pageIndex: i })}
                    animationType="spring"
                    animationConfig={{ useNativeDriver: true, speed: 100 }}
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
                        <SettingsPage />
                    </TabView.Item>
                </TabView>

                <View style={{ width: "100%", height: this.state.isQuickControlVisible ? 130 : 40, backgroundColor: "#0c0f17", zIndex: 0 }} />
                <LinearGradient
                    colors={["transparent", "#0c0f17"]}
                    style={{ position: "absolute", bottom: this.state.isQuickControlVisible ? 110 : 20, width: "100%", height: 40 }}
                    locations={[0, 0.4]}
                />
                <NavBar pageIndex={this.state.pageIndex} setPageIndex={(i) => this.setState({ pageIndex: i })} />

                <PlayingTrackPage
                    showPage={this.state.showPlayingTrackPage}
                    showPageFn={(show) => this.setState({ showPlayingTrackPage: show })}
                />
                <PlaylistsPage showPage={this.state.showPlaylistsPage} />
                <PlaylistPage showPage={this.state.showPlaylistPage} />

                <View style={style.control}>
                    <QuickControl
                        showPlayingTrackPage={() => this.setState({ showPlayingTrackPage: true })}
                        isQuickControlVisible={(visible) => this.setState({ isQuickControlVisible: visible })}
                    />
                </View>
            </>
        ) : (
            <>
                <LoginPage />
            </>
        )
    }
}

export default App;
