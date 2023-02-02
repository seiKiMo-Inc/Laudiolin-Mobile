import React from "react";
import { ScrollView, View } from "react-native";

import BasicTextInput from "@components/common/BasicTextInput";
import Track from "@components/Track";

import { SearchPageStyle } from "@styles/PageStyles";
import { Icon } from "@rneui/base";

import { TrackData } from "@backend/types";
import { playTrack } from "@backend/audio";
import { doSearch } from "@backend/search";

interface IState {
    results: TrackData[];
}

class SearchPage extends React.Component<any, IState> {
    timeout: any|null = null;

    constructor(props: any) {
        super(props);

        this.state = {
            results: []
        };
    }

    /**
     * Called when the search query is updated.
     * @param query The new search query.
     */
    updateQuery(query: string): void {
        // Check if the query is empty.
        if (query.trim().length == 0) {
            // Clear the state.
            this.setState({ results: [] });
            // Clear the timeout.
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }

            return;
        }

        // Check if there is an existing timeout.
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        this.timeout = setTimeout(async () => {
            // Perform a search.
            const { results } = await doSearch(query);
            // Update the state.
            this.setState({ results });

            // Clear the timeout.
            this.timeout = null;
        }, 100);
    }

    /**
     * Called when a track is clicked.
     * @param track The track that was clicked.
     */
    async playTrack(track: TrackData): Promise<void> {
        await playTrack(track, true, true);
    }

    render() {
        return (
            <ScrollView contentContainerStyle={SearchPageStyle.container}>
                <View style={{ alignItems: "center" }}>
                    <BasicTextInput
                        default={"Search"}
                        onChange={text => this.updateQuery(text)}
                        textStyle={SearchPageStyle.searchText}
                        containerStyle={SearchPageStyle.searchContainer}
                        icon={<Icon
                            type="material" name={"search"}
                            iconStyle={{ color: "white", paddingBottom: 5, paddingLeft: 5 }}
                        />}
                    />
                </View>

                <View style={SearchPageStyle.results}>
                    {
                        this.state.results.map((track, index) => (
                            <Track
                                key={index} track={track} padding={10}
                                onClick={track => this.playTrack(track)}
                            />
                        ))
                    }
                </View>
            </ScrollView>
        );
    }
}

export default SearchPage;
