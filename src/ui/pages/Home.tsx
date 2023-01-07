import type { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import type { TrackData } from "@backend/types";

import React from "react";
import { Button, Text, TextInput } from "react-native";

import { test, playTrack } from "@backend/audio";
import { navigate } from "@backend/navigation";
import { doSearch } from "@backend/search";

interface IState {
    info: string;
    query: string;
    top: TrackData | null;
}

class Home extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            info: "This message will update with useful info.",
            query: "hikaru nara",
            top: null
        };
    }

    dev = async() => {
        await test();
    };

    updateQuery = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        this.setState({ query: event.nativeEvent.text });
    };

    search = async() => {
        this.setState({ info: `Searching for ${this.state.query}` })
        const result = await doSearch(this.state.query);
        this.setState({
            top: result.top, info: `Top Title: ${result.top.title}`
        });
    };

    playTop = async() => {
        if (!this.state.top) return;
        await playTrack(this.state.top);
    };

    render() {
        return (
            <>
                <Text>{this.state.info}</Text>
                <Button title={"Play Audio"} onPress={this.dev} />
                <Button title={"Search Page"} onPress={() => navigate("Search")} />

                <TextInput onChange={this.updateQuery}>{this.state.query}</TextInput>
                <Button title={"Search"} onPress={this.search} />
                <Button title={"Play Top Result"} onPress={this.playTop} />
            </>
        );
    }
}

export default Home;
