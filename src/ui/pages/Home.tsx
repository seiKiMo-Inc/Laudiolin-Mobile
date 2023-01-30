import type { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import type { TrackData } from "@backend/types";

import React from "react";
import { Button, View } from "react-native";

import BasicText from "@components/common/BasicText";
import SearchTrack from "@components/search/SearchTrack";
import Controls from "@components/player/Controls";
import BasicTextInput from "@components/common/BasicTextInput";

import { playTrack } from "@backend/audio";
import { navigate } from "@backend/navigation";
import { doSearch } from "@backend/search";

const track: TrackData = {
    title: "Travelogue (Global Acappella Ver.)",
    artist: "",
    icon: "https://app.seikimo.moe/proxy/dgfzSddP2IOxN_oOzGkytSjYkeKnbapvioYWp9oC_7vPudR3Ln2gF5Pw7SL3IMWNYyWIsDVp3d3nGqw4=w120-h120-l90-rj?from=cart",
    url: "http://10.0.2.2:3000/download?id=n-HypaOLx_s&engine=YouTube",
    id: "n-HypaOLx_s",
    duration: 186
};

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
            <View>
                <BasicText text={this.state.info} />
                <Button title={"Search Page"} onPress={() => navigate("Search")} />

                <BasicTextInput default={this.state.query} />
                <Button title={"Search"} onPress={this.search} />
                <Button title={"Play Top Result"} onPress={this.playTop} />

                <SearchTrack result={this.state.top} onClick={() => {}} />

                <Controls />
            </View>
        );
    }
}

export default Home;
