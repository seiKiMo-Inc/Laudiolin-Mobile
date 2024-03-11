import { ScrollView, View, Dimensions, FlatList } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp } from "@react-navigation/native";

import Track from "@widgets/Track";
import Playlist from "@widgets/Playlist";
import StyledButton from "@components/StyledButton";
import StyledText, { Size } from "@components/StyledText";

import { first, welcomeText } from "@backend/utils";
import { usePlaylists, useRecents } from "@backend/stores";

import style from "@style/Summary";

interface IHeaderProps {
    navigation: NavigationProp<any>;
    children: string;
    data: any;
}

function Header({ navigation, children, data }: IHeaderProps) {
    return (
        <View style={style.Summary_Header}>
            <StyledText text={children}
                        size={Size.Subtitle}
                        bold />

            <StyledText
                underlined
                text={"More"}
                size={Size.Footnote}
                onPress={() => navigation.navigate("Named List", data)}
            />
        </View>
    )
}

interface IProps {
    navigation: NavigationProp<any>;
}

function Summary({ navigation }: IProps) {
    let recents = useRecents();
    recents = Object.values(recents);

    let playlists = usePlaylists();
    playlists = Object.values(playlists);

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
                <Header
                    navigation={navigation}
                    data={{ title: "Playlists", items: playlists, render: "playlists" }}
                >
                    Playlists
                </Header>

                <FlatList
                    data={playlists}
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
                <Header
                    navigation={navigation}
                    data={{ title: "Downloads", items: recents, render: "tracks" }}
                >
                    Downloads
                </Header>

                <View style={style.Summary_TrackList}>
                    {first(recents, 3).map((track) => (
                        <Track
                            key={track.id}
                            data={track}
                        />
                    ))}
                </View>
            </View>

            <View style={style.Summary_Block}>
                <Header
                    navigation={navigation}
                    data={{ title: "Recents", items: recents, render: "tracks" }}
                >
                    Recents
                </Header>

                <View style={style.Summary_TrackList}>
                    {first(recents, 3).map((track) => (
                        <Track
                            key={track.id}
                            data={track}
                        />
                    ))}
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
