import React from "react";
import { ScrollView, View } from "react-native";

import BasicTextInput from "@components/common/BasicTextInput";
import Track from "@components/Track";
import BasicText from "@components/common/BasicText";
import { SearchPageStyle } from "@styles/PageStyles";
import { Icon } from "@rneui/base";
import ContentLoader from "@components/common/ContentLoader";

import { TrackData } from "@backend/types";
import { playTrack } from "@backend/audio";
import { doSearch } from "@backend/search";

interface IState {
    results: TrackData[];
    isLoading: boolean;
}

class SearchPage extends React.Component<any, IState> {
    timeout: any|null = null;

    constructor(props: any) {
        super(props);

        this.state = {
            results: [],
            isLoading: false,
        };
    }

    /**
     * Called when the search query is updated.
     * @param query The new search query.
     */
    updateQuery(query: string): void {
        // Clear the results.
        this.setState({ results: [] });

        // Check if the query is empty.
        if (query.trim().length == 0) {
            // Clear the timeout.
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.setState({ isLoading: false });
            return;
        }

        this.setState({ isLoading: true })

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
            this.setState({ isLoading: false });

            // Clear the timeout.
            this.timeout = null;
        }, 1000);
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
            <View style={SearchPageStyle.container}>
                <View style={{ alignItems: "center" }}>
                    <BasicTextInput
                        default={"Search"}
                        onChange={text => this.updateQuery(text)}
                        textStyle={SearchPageStyle.searchText}
                        containerStyle={SearchPageStyle.searchContainer}
                        icon={<Icon
                            type="material" name={"search"}
                            iconStyle={{ color: "white", paddingLeft: 5 }}
                        />}
                    />
                </View>

                <ScrollView contentContainerStyle={SearchPageStyle.results}>
                    {
                        this.state.results.length > 0 ?
                            this.state.results.map((track, index) => (
                                <Track
                                    key={index} track={track} padding={10}
                                    onClick={track => this.playTrack(track)}
                                />
                            ))
                            : !this.state.isLoading ? (
                                <BasicText text={"No results."} containerStyle={{ padding: 50, alignItems: "center" }} />
                            ) : <ContentLoader style={{ padding: 50, alignItems: "center" }} />
                    }
                </ScrollView>
            </View>
        );
    }
}

export default SearchPage;
