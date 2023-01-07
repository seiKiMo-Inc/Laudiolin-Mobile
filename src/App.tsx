import type { ReactNode } from "react";

import { Component } from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import { registerListener } from "@backend/navigation";

import Home from "@app/ui/pages/Home";
import SearchPage from "@app/ui/pages/SearchPage";

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: "center"
    }
});

const pages: any = {
    Home: <Home />,
    Search: <SearchPage />
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
