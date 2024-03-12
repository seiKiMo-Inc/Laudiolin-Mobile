import { ScrollView, View, Dimensions, FlatList } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp } from "@react-navigation/native";

import Track from "@widgets/Track";
import Playlist from "@widgets/Playlist";
import StyledButton from "@components/StyledButton";
import StyledText, { Size } from "@components/StyledText";

import Backend from "@backend/backend";
import { first, welcomeText } from "@backend/utils";
import { useFavorites, usePlaylists, useRecents, useUser } from "@backend/stores";
import { PlaylistInfo, TrackInfo, User } from "@backend/types";

import style from "@style/Summary";

type PlaylistIcon = PlaylistInfo | {
    type: "button";
    id: string;
    icon: string; name: string;
    onPress?: () => void;
};

/**
 * Injects "custom playlists" into the list of playlists.
 *
 * @param playlists The list of playlists.
 * @param user The user's information.
 * @param favorites The user's favorite tracks.
 */
function getPlaylists(
    playlists: PlaylistInfo[],
    user: User | null, favorites: TrackInfo[]
): PlaylistIcon[] {
    const items: PlaylistIcon[] = [];
    if (user) {
        items.push({
            type: "info",
            id: "favorites",
            owner: user?.userId ?? "",
            name: "Favorites",
            description: "All your liked songs!",
            icon: `${Backend.getBaseUrl()}/Favorite.png`,
            isPrivate: true,
            tracks: favorites
        });
    }

    items.push(
        ...playlists,
        {
            type: "button", id: "add", icon: "", name: "Add a Playlist",
            onPress: () => console.log("Add a Playlist")
        }
    );

    return items;
}

interface IHeaderProps {
    navigation: NavigationProp<any>;
    children: string;
    data: {
        title: string;
        items: any[];
        render: string;
        more: number;
    };
}

function Header({ navigation, children, data }: IHeaderProps) {
    return (
        <View style={style.Summary_Header}>
            <StyledText text={children}
                        size={Size.Subtitle}
                        bold />

            {
                data.items.length > data.more ? (
                    <StyledText
                        underlined
                        text={"More"}
                        size={Size.Footnote}
                        onPress={() => navigation.navigate("Named List", data)}
                    />
                ) : undefined
            }
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

    const user = useUser();
    const favorites = useFavorites();

    const playlistItems = getPlaylists(
        first(playlists, 5),
        user, Object.values(favorites));

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
                    data={{ title: "Playlists", items: playlists,
                        render: "playlists", more: 5 }}
                >
                    Playlists
                </Header>

                <FlatList
                    data={playlistItems}
                    renderItem={({ item }) => (
                        <Playlist
                            key={item.id}
                            playlist={item}
                            onPress={() => {
                                if (item.type == "button") {
                                    item.onPress?.();
                                } else {
                                    navigation.navigate("Playlist", { playlist: item });
                                }
                            }}
                        />
                    )}
                    contentContainerStyle={style.Summary_Playlist}
                    horizontal showsHorizontalScrollIndicator={false}
                />
            </View>

            { recents.length == 0 && (
                <StyledText text={"No content found, go download tracks or listen to music!"} lines={2}
                            style={{ textAlign: "center" }} size={Size.Subheader}
                />
            ) }

            { recents.length > 0 && (
                <View style={style.Summary_Block}>
                    <Header
                        navigation={navigation}
                        data={{ title: "Downloads", items: recents,
                            render: "tracks", more: 3 }}
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
            ) }

            { recents.length > 0 && (
                <View style={style.Summary_Block}>
                    <Header
                        navigation={navigation}
                        data={{ title: "Recents", items: recents,
                            render: "tracks", more: 3 }}
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
            ) }

            {
                __DEV__ && <>
                    <StyledButton
                        text={"Text Playground"}
                        onPress={() => navigation.navigate("Text Playground")}
                    />

                    <StyledButton
                        text={"Track Playground"}
                        onPress={() => navigation.navigate("Track Playground")}
                    />
                </>
            }
        </ScrollView>
    );
}

export default Summary;
