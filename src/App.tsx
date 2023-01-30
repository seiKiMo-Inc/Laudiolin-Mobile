import { Component } from "react";
import { TabView } from "@rneui/themed";

import Home from "@pages/Home";
import SearchPage from "@pages/SearchPage";
import LoginPage from "@pages/LoginPage";
import SettingsPage from "@pages/SettingsPage";

import NavBar from "@components/NavBar";

interface IState {
    pageIndex: number;
    loggedIn: boolean;
}

class App extends Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            pageIndex: 0,
            loggedIn: false
        };
    }

    render() {
        return this.state.loggedIn ? (
            <>
                <TabView
                    value={this.state.pageIndex}
                    onChange={(i) => this.setState({ pageIndex: i })}
                    animationType="spring"
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
            </>
        ) : (
            <>
                <LoginPage />
            </>
        )
    }
}

export default App;
