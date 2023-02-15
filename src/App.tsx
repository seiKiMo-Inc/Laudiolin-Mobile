import React from "react";
import { StyleSheet, BackHandler, View, StatusBar, AppState } from "react-native";

import LinearGradient from "react-native-linear-gradient";
import SplashScreen from "react-native-splash-screen";
import TrackPlayer from "react-native-track-player";
import NetInfo from "@react-native-community/netinfo";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'

import Home from "@pages/Home";
import SearchPage from "@pages/SearchPage";
import LoginPage from "@pages/LoginPage";
import InformationPage from "@pages/InformationPage";
import SettingsPage from "@pages/SettingsPage";
import PlaylistsPage from "@pages/PlaylistsPage";
import PlayingTrackPage from "@pages/PlayingTrackPage";
import PlaylistPage from "@pages/PlaylistPage";
import DownloadsPage from "@pages/DownloadsPage";

import PlaylistSelectModal from "@modals/PlaylistSelectModal";
import QuickControl from "@components/player/QuickControl";
import { MenuProvider } from "react-native-popup-menu";

import * as user from "@backend/user";
import emitter from "@backend/events";
import { get, save } from "@backend/settings";
import { loadState, isOffline } from "@backend/offline";
import { loadPlayerState, savePlayerState } from "@app/utils";
import { loadNotifications, saveNotifications } from "@backend/notifications";
import { registerListener, removeListeners } from "@backend/navigation";

interface IState {
    loggedIn: boolean;

    showPlayingTrackPage: boolean;
    showPlaylistsPage: boolean;
    showPlaylistPage: boolean;
    showDownloadPage: boolean;

    isQuickControlVisible: boolean;
    notificationCount: number | string | undefined;
    reloadKey: "not-loaded" | "loaded";
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
            loggedIn: user.userData != null,

            showPlayingTrackPage: false,
            showPlaylistsPage: false,
            showPlaylistPage: false,
            showDownloadPage: false,

            notificationCount: undefined,
            isQuickControlVisible: false,
            reloadKey: "not-loaded"
        };
    }

    /**
     * Continues the app loading process.
     */
    async continueLoading(): Promise<void> {
        const result = await get("authenticated");
        if (result == "guest") {
            this.setState({ loggedIn: true });
        }

        // Load notification count.
        let notificationCount = await get("notificationCount");
        if (!notificationCount)  notificationCount = "0";
        if (notificationCount !== "undefined")
            this.setState({ notificationCount: parseInt(notificationCount) > 9 ? "9+" : parseInt(notificationCount) < 1 ? undefined : notificationCount });
        else
            this.setState({ notificationCount: undefined });

        // Re-render the app.
        this.setState({ reloadKey: "loaded" });
    }

    componentDidMount() {
        // Listen for the login event.
        emitter.on("login", this.onLogin);
        // Login to Laudiolin.
        NetInfo.fetch()
            .then(state => {
                if (state.isConnected) {
                    // Login over the network.
                    user.login().then(() => this.continueLoading());
                } else {
                    // Load the offline state.
                    setTimeout(() => loadState(
                        user.loaders.userData,
                        user.loaders.playlists,
                        user.loaders.favorites,
                    ).then(() => this.setState({ reloadKey: "loaded" })), 1e3);
                }
            })
            .catch(err => console.error(err));

        registerListener(page => {
            switch (page) {
                default:
                    return;
                case "Home":
                    this.setState({
                        loggedIn: true,
                        showPlayingTrackPage: false,
                        showPlaylistsPage: false,
                        showPlaylistPage: false,
                        showDownloadPage: false
                    });
                    return;
                case "Login":
                    this.setState({
                        loggedIn: false,
                        showPlayingTrackPage: false,
                        showPlaylistsPage: false,
                        showPlaylistPage: false,
                        showDownloadPage: false
                    });
                    return;
                case "Playlist":
                    this.setState({
                        showPlayingTrackPage: false,
                        showPlaylistsPage: false,
                        showPlaylistPage: true,
                        showDownloadPage: false
                    });
                    return;
                case "Playing":
                    this.setState({
                        showPlayingTrackPage: true,
                        showPlaylistsPage: false,
                        showPlaylistPage: false,
                        showDownloadPage: false
                    });
                    return;
                case "Playlists":
                    this.setState({
                        showPlayingTrackPage: false,
                        showPlaylistsPage: true,
                        showPlaylistPage: false,
                        showDownloadPage: false
                    });
                    return;
                case "Downloads":
                    this.setState({
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

        AppState.addEventListener("change", state =>
            emitter.emit("appState", state));

        // Load application data.
        setTimeout(() => {
            loadPlayerState()
                .catch(err => console.error(err)); // Load the player state.
            loadNotifications()
                .catch(err => console.error(err)); // Load the notifications.
        }, 3e3);

        // Add event listeners for notifications.
        emitter.on("notificationReset", () => {
            this.setState({ notificationCount: undefined })
        });
        emitter.on("notificationUpdate", () => {
            this.setState({
                notificationCount: this.state.notificationCount == undefined ?
                    1 : this.state.notificationCount == "9+" ?
                        "9+" : parseInt(this.state.notificationCount as string) + 1
            })
        });

        // Hide the splash screen.
        if (SplashScreen) SplashScreen.hide();
    }

    async componentWillUnmount() {
        emitter.removeListener("login", this.onLogin);
        removeListeners(); // Remove navigation listeners.

        await save("notificationCount", this.state.notificationCount === undefined ? "undefined" : this.state.notificationCount as string); // Save the notification count.
        await saveNotifications(); // Save the notifications.
        await savePlayerState(); // Save the player state.
        await TrackPlayer.reset(); // Destroy the player.
    }

    render() {
        const Tab = createBottomTabNavigator();

        return this.state.loggedIn ? (
            <MenuProvider key={this.state.reloadKey} style={{ backgroundColor: "#0c0f17" }}>
                <StatusBar translucent backgroundColor="transparent" />

                <NavigationContainer>
                    <Tab.Navigator
                        initialRouteName="Home"
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ focused, color, size }) => {
                                let iconName: string = "";

                                if (route.name === "Home") {
                                    iconName = focused ? "home" : "home-outline";
                                } else if (route.name === "Search") {
                                    iconName = focused ? "search" : "search-outline";
                                } else if (route.name === "Information") {
                                    iconName = focused ? "information" : "information-outline";
                                } else if (route.name === "Settings") {
                                    iconName = focused ? "settings" : "settings-outline";
                                }

                                return <Ionicons name={iconName} size={size} color={color} />;
                            },
                            headerShown: false,
                            tabBarShowLabel: false,
                            tabBarStyle: {
                                backgroundColor: "transparent",
                                borderTopColor: "transparent",
                                position: "absolute",
                            },
                            tabBarBackground: () => (<LinearGradient
                                colors={["transparent", "#0c0f17", "#1f2442"]}
                                style={{ position: "absolute", bottom: 0, width: "100%", height: 70 }}
                                locations={[0, 0.4, 1]}
                            />)
                        })}
                        sceneContainerStyle={{ backgroundColor: "#0c0f17", marginBottom: this.state.isQuickControlVisible ? 100 : 30 }}
                    >
                        <Tab.Screen name="Home" component={Home} />
                        {!isOffline && <Tab.Screen name="Search" component={SearchPage} />}
                        {!isOffline && <Tab.Screen name="Information"
                                                   component={InformationPage}
                                                   options={{ tabBarBadge: this.state.notificationCount, tabBarBadgeStyle: { verticalAlign: "middle" } }} />}
                        <Tab.Screen name="Settings" component={SettingsPage} />
                    </Tab.Navigator>
                </NavigationContainer>

                <PlayingTrackPage showPage={this.state.showPlayingTrackPage} />
                <PlaylistsPage showPage={this.state.showPlaylistsPage} />
                <PlaylistPage showPage={this.state.showPlaylistPage} />
                <DownloadsPage showPage={this.state.showDownloadPage} />

                <PlaylistSelectModal />

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
