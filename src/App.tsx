import { Component } from "react";
import { TabView } from "@rneui/themed";

import Home from "@pages/Home";
import SearchPage from "@pages/SearchPage";
import LoginPage from "@pages/LoginPage";
import SettingsPage from "@pages/SettingsPage";

import NavBar from "@components/NavBar";

interface IState {
    pageIndex: number;
}

class App extends Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            pageIndex: 0
        };
    }

    render() {
        return (
            <>
                <TabView
                    value={this.state.pageIndex}
                    onChange={(i) => this.setState({ pageIndex: i })}
                    animationType="spring"
                    disableSwipe={true}
                    tabItemContainerStyle={{ alignItems: "center", justifyContent: "center" }}>
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
        );
    }
}

export default App;
