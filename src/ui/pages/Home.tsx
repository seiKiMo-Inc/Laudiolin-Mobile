import React from "react";
import { FlatList, ScrollView, View } from "react-native";

import BasicText from "@components/common/BasicText";

import { HomePageStyle } from "@styles/PageStyles";
import { Image } from "@rneui/base";
import Track from "@components/Track";

const testTrack = {
    title: "Hikaru Nara (Your Lie In April)",
    artist: "Otaku",
    icon: "https://i.scdn.co/image/ab67616d0000b273cbd6575a821e3a9bee15fc93",
    url: "https://open.spotify.com/track/1eznJLhlnbXrXuO8Ykkhhg",
    id: "FRR642100241",
    duration: 117
};

class HomePlaylist extends React.Component<any, any> {
    render() {
        return (
            <View style={HomePageStyle.playlist}>
                <Image
                    source={require("../../../resources/images/icon.png")}
                    style={HomePageStyle.playlistImage}
                />
            </View>
        );
    }
}

class Home extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <ScrollView contentContainerStyle={HomePageStyle.text}>
                <View style={{ paddingBottom: 20 }}>
                    <View style={{ flexDirection: "row" }}>
                        <BasicText text={"Playlists"} style={HomePageStyle.header} />
                        <View style={{ justifyContent: "center" }}>
                            <BasicText text={"More"} style={HomePageStyle.morePlaylists} />
                        </View>
                    </View>
                    <FlatList
                        style={HomePageStyle.playlists}
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        renderItem={() => <HomePlaylist />}
                        horizontal showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View style={{ paddingBottom: 20 }}>
                    <View style={{ flexDirection: "row" }}>
                        <BasicText text={"Downloads"} style={HomePageStyle.header} />
                        <View style={{ justifyContent: "center" }}>
                            <BasicText text={"More"} style={HomePageStyle.moreDownloads} />
                        </View>
                    </View>

                    <View>
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                    </View>
                </View>

                <View>
                    <View style={{ flexDirection: "row" }}>
                        <BasicText text={"Recent Plays"} style={HomePageStyle.header} />
                        <View style={{ justifyContent: "center" }}>
                            <BasicText text={"More"} style={HomePageStyle.morePlays} />
                        </View>
                    </View>

                    <View>
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                        <Track track={testTrack} padding={15} />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default Home;
