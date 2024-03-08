import { ScrollView, View, Dimensions, FlatList } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp } from "@react-navigation/native";

import Track from "@widgets/Track";
import Playlist from "@widgets/Playlist";
import StyledButton from "@components/StyledButton";
import StyledText, { Size } from "@components/StyledText";

import { welcomeText } from "@backend/utils";

import style from "@style/Summary";

interface IHeaderProps {
    navigation: NavigationProp<any>;
    children: string;
    to: string;
}

function Header(props: IHeaderProps) {
    return (
        <View style={style.Summary_Header}>
            <StyledText text={props.children}
                        size={Size.Subtitle}
                        bold />

            <StyledText
                underlined
                text={"More"}
                size={Size.Footnote}
                onPress={() => props.navigation.navigate(props.to)}
            />
        </View>
    )
}

interface IProps {
    navigation: NavigationProp<any>;
}

const aTrack = {
    id: "test",
    title: "test track",
    artist: "test artist",
    icon: "https://picsum.photos/256/256?random=2",
    duration: 420,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
}

const aPlaylist = {
    id: "test",
    author: "caramels.",
    name: "a really long playlist name",
    description: "the playlist description",
    icon: "https://picsum.photos/256/256?random=1",
    isPrivate: true,
    tracks: []
}

function Summary({ navigation }: IProps) {
    return (
        <ScrollView
            contentContainerStyle={style.Summary}
            bounces={false}
        >
            <LinearGradient
                colors={["#354ab2", "transparent"]}
                style={{
                    position: "absolute",
                    top: 0,
                    height: 120,
                    zIndex: 0,
                    width: Dimensions.get("screen").width,
                }}
            />

            <StyledText text={welcomeText()} size={Size.Subheader} />

            <View style={style.Summary_Block}>
                <Header navigation={navigation} to={"Playlists"}>Playlists</Header>
                <FlatList
                    data={[aPlaylist, aPlaylist, aPlaylist, aPlaylist, aPlaylist]}
                    renderItem={({ item }) => (
                        <Playlist
                            key={item.id}
                            playlist={item}
                            onPress={() => navigation.navigate("Playlist", { playlist: item })}
                        />
                    )}
                    contentContainerStyle={style.Summary_Playlist}
                    horizontal showsHorizontalScrollIndicator={false}
                />
            </View>

            <View style={style.Summary_Block}>
                <Header navigation={navigation} to={"Downloads"}>Downloads</Header>
                <View style={style.Summary_TrackList}>
                    <Track data={aTrack} />
                    <Track data={aTrack} />
                    <Track data={aTrack} />
                </View>
            </View>

            <View style={style.Summary_Block}>
                <Header navigation={navigation} to={"Recents"}>Recents</Header>
                <View style={style.Summary_TrackList}>
                    <Track data={aTrack} />
                    <Track data={aTrack} />
                    <Track data={aTrack} />

                </View>
            </View>

            <StyledButton
                text={"Text Playground"}
                onPress={() => navigation.navigate("Text Playground")}
            />

            <StyledButton
                text={"Track Playground"}
                onPress={() => navigation.navigate("Track Playground")}
            />
        </ScrollView>
    );
}

export default Summary;
