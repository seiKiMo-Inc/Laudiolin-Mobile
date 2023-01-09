import { Component, ReactNode } from "react";
import { SafeAreaView } from "react-native";

import { registerListener } from "@backend/navigation";

import Home from "@pages/Home";
import SearchPage from "@pages/SearchPage";
import LoginPage from "@pages/LoginPage";

import { styles } from "@styles/AppStyle"

const pages: any = {
    Home: <Home />,
    Search: <SearchPage />,
    Login: <LoginPage />
};

interface IState {
    page: ReactNode;
}

class App extends Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            page: pages.Home
        };
    }

    componentDidMount() {
        registerListener(page => {
            this.setState({ page: (pages[page] as ReactNode) ?? pages.Home });
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.state.page}
            </SafeAreaView>
        );
    }
}

export default App;
