import React from "react";
import { StyleSheet, View } from "react-native";

import { TabView } from "@rneui/themed";

import Home from "@pages/Home";
import SearchPage from "@pages/SearchPage";
import LoginPage from "@pages/LoginPage";
import SettingsPage from "@pages/SettingsPage";
import PlaylistsPage from "@pages/PlaylistsPage";
import PlayingTrackPage from "@pages/PlayingTrackPage";

import NavBar from "@components/NavBar";
import PlaylistPage from "@pages/PlaylistPage";
import QuickControl from "@components/player/QuickControl";

class Hide extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return this.props.show ? this.props.children : null;
    }
}

interface IState {
    pageIndex: number;
    loggedIn: boolean;

    showTabs: boolean;
    showPlayingTrackPage: boolean;
    showPlaylistsPage: boolean;
    showPlaylistPage: boolean;
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
            loggedIn: true,

            showTabs: true,
            showPlayingTrackPage: false,
            showPlaylistsPage: false,
            showPlaylistPage: false
        };
    }

    render() {
        return this.state.loggedIn ? (
            <>
                <Hide show={this.state.showTabs}>
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

                    <NavBar pageIndex={this.state.pageIndex} setPageIndex={(i) => this.setState({ pageIndex: i })} />
                </Hide>

                <PlayingTrackPage showPage={this.state.showPlayingTrackPage} />
                <PlaylistsPage showPage={this.state.showPlaylistsPage} />
                <PlaylistPage showPage={this.state.showPlaylistPage} />

                <Hide show={true}>
                    <View style={style.control}>
                        <QuickControl />
                    </View>
                </Hide>
            </>
        ) : (
            <>
                <LoginPage />
            </>
        )
    }
}

export default App;
