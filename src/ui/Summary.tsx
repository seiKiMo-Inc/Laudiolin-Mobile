import { useState } from "react";
import { ScrollView, View, Dimensions, FlatList, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp } from "@react-navigation/native";

import Track from "@widgets/Track";
import Playlist from "@widgets/Playlist";
import StyledButton from "@components/StyledButton";
import StyledText, { Size } from "@components/StyledText";

import CreatePlaylist from "@modals/CreatePlaylist";

import Backend from "@backend/backend";
import { first, welcomeText } from "@backend/utils";
import { useDownloads, useFavorites, usePlaylists, useRecents, useUser } from "@backend/stores";
import { OwnedPlaylist, TrackInfo, User } from "@backend/types";
import { value } from "@style/Laudiolin";

type PlaylistIcon = OwnedPlaylist | {
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
 * @param showPlaylistModal Callback function to show the playlist modal.
 */
function formPlaylists(
    playlists: OwnedPlaylist[],
    user: User | null, favorites: TrackInfo[],
    showPlaylistModal: () => void
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
            id: "add",
            type: "button",
            icon: `${Backend.getBaseUrl()}/Playlist.png`,
            name: "Add a Playlist",
            onPress: showPlaylistModal
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
    );
}

interface IProps {
    navigation: NavigationProp<any>;
}

function Summary({ navigation }: IProps) {
    let recents = useRecents();
    recents = Object.values(recents);

    let playlists = usePlaylists();
    playlists = Object.values(playlists);

    const downloadData = useDownloads();
    const downloads = downloadData.downloaded;

    const user = useUser();
    const favorites = useFavorites();

    const [makePlaylist, setMakePlaylist] = useState(false);

    const playlistItems = formPlaylists(
        first(playlists, 5),
        user, Object.values(favorites),
        () => setMakePlaylist(true)
    );

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

            <StyledText
                text={welcomeText()} size={Size.Subheader}
                style={{ color: "white" }}
            />

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

            { recents.length == 0 && downloads.length == 0 && (
                <StyledText text={"No content found, go download tracks or listen to music!"} lines={2}
                            style={{ textAlign: "center" }} size={Size.Subheader}
                />
            ) }

            { downloads.length > 0 && (
                <View style={style.Summary_Block}>
                    <Header
                        navigation={navigation}
                        data={{ title: "Downloads", items: downloads,
                            render: "tracks", more: 3 }}
                    >
                        Downloads
                    </Header>

                    <View style={style.Summary_TrackList}>
                        {first(downloads, 3).map((track) => (
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
                (__DEV__ || user?.isDeveloper) && <>
                    <StyledButton
                        text={"Text Playground"}
                        onPress={() => navigation.navigate("Text Playground")}
                    />

                    <StyledButton
                        text={"Track Playground"}
                        onPress={() => navigation.navigate("Track Playground")}
                    />

                    <StyledButton
                        text={"Debug"}
                        onPress={() => navigation.navigate("Debug")}
                    />
                </>
            }

            <CreatePlaylist visible={makePlaylist} hide={() => setMakePlaylist(false)} />
        </ScrollView>
    );
}

export default Summary;

const style = StyleSheet.create({
    Summary: {
        flexGrow: 0,
        flexShrink: 0,
        width: "100%",
        gap: 35,
        padding: value.padding,
        paddingTop: 25,
        overflow: "scroll"
    },
    Summary_Header: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    Summary_Block: {
        gap: 15
    },
    Summary_Playlist: {
        gap: 15
    },
    Summary_TrackList: {
        gap: 15
    }
});
