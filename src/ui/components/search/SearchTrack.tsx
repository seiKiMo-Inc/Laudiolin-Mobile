import type { Playlist, SearchResult } from "@backend/types";

import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "@rneui/base";

interface IProps {
    result: SearchResult;
    onClick: () => void;
}

interface IState {
    playing: boolean;
    hasPlayed: boolean;
    playlists: Playlist[];
}

const styleSheet = StyleSheet.create({

});

class SearchTrack extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            playing: false,
            hasPlayed: false,
            playlists: []
        };
    }

    render() {
        const { result } = this.props;

        return (
            <>
                <Button title={"test button"}
                        onLongPress={() => console.log("a")}
                        onPress={() => console.log("b")}
                        onPressOut={() => console.log("c")}
                        onPressIn={() => console.log("d")}
                />
            </>
        );
    }
}

export default SearchTrack;
