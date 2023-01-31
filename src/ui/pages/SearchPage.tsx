import React from "react";
import { ScrollView, View } from "react-native";

import BasicTextInput from "@components/common/BasicTextInput";
import Track from "@components/Track";

import { SearchPageStyle } from "@styles/PageStyles";
import { Icon } from "@rneui/base";

import { TrackData } from "@backend/types";

const track: TrackData = {
    title: "Right Here I Stand",
    artist: "Project Mons",
    icon: "https://i.scdn.co/image/ab67616d0000b27348e08afae141c0d4068ed8f6",
    url: "https://open.spotify.com/track/332kSnfRDixW3QWogulBd2",
    id: "usl4q2126614",
    duration: 225
};

class SearchPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <ScrollView contentContainerStyle={SearchPageStyle.container}>
                <View style={{ alignItems: "center" }}>
                    <BasicTextInput
                        default={"Search"}
                        textStyle={SearchPageStyle.searchText}
                        containerStyle={SearchPageStyle.searchContainer}
                        icon={<Icon
                            type="material" name={"search"}
                            iconStyle={{ color: "white" }}
                        />}
                    />
                </View>

                <View style={SearchPageStyle.results}>
                    <Track track={track} />
                </View>
            </ScrollView>
        );
    }
}

export default SearchPage;
