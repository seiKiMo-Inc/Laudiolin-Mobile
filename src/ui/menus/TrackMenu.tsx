import { Share, StyleProp } from "react-native";

import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
import { NavigationContainerRef } from "@react-navigation/core";

import MaIcon from "react-native-vector-icons/MaterialIcons";
import McIcon from "react-native-vector-icons/MaterialCommunityIcons";

import useLocal from "@hooks/useLocal";
import useFavorite from "@hooks/useFavorite";
import StyledMenu from "@components/StyledMenu";

import User from "@backend/user";
import Player from "@backend/player";
import Backend from "@backend/backend";
import Playlist from "@backend/playlist";
import Downloads from "@backend/downloads";

import { useColor } from "@backend/stores";

import { DownloadInfo, OwnedPlaylist, RemoteInfo, TrackInfo } from "@backend/types";

interface IProps {
    opened: boolean;
    close: () => void;

    navigation?: NavigationContainerRef<any>;

    showAdd?: () => void;
    onNavigate?: () => void;

    track: TrackInfo | undefined;
    playlist?: OwnedPlaylist;

    hideShowDetails?: boolean;
    hideAddQueue?: boolean;

    style?: StyleProp<any> | any;
}

function TrackMenu(props: IProps) {
    const { track, opened, close, playlist } = props;
    const navigation = props.navigation ?? useNavigation();

    const isFavorite = useFavorite(track);
    const local = useLocal(track);

    const colors = useColor();

    return (
        <StyledMenu
            closeOnPress
            opened={opened}
            close={() => close()}
            options={[
                !props.hideShowDetails ? {
                    text: "Show Details",
                    icon: <MaIcon name={"info"} size={24} color={colors.text} />,
                    onPress: () => {
                        navigation!.navigate("Track", { track });
                        props.onNavigate?.();
                    }
                } : undefined,
                !props.hideAddQueue ? {
                    text: "Add to Queue",
                    icon: <MaIcon name={"queue"} size={24} color={colors.text} />,
                    onPress: () => Player.play(track, { playlist })
                } : undefined,
                playlist?.id != "favorites" ? {
                    text: `${playlist ? "Remove from" : "Add to"} Playlist`,
                    icon: playlist ?
                        <McIcon name={"playlist-minus"} size={24} color={colors.text} /> :
                        <McIcon name={"playlist-plus"} size={24} color={colors.text} />,
                    onPress: () => {
                        if (track && playlist) {
                            Playlist.removeTrackFromPlaylist(playlist, track)
                                .catch(() => null);
                        } else {
                            props.showAdd?.();
                        }
                    }
                } : undefined,
                track && track.url.length > 0 ? {
                    text: "Open Track Source",
                    icon: <McIcon name={"web"} size={24} color={colors.text} />,
                    onPress: () => WebBrowser.openBrowserAsync(track.url)
                } : undefined,
                track && track.type == "remote" ? {
                    text: "Share Track",
                    icon: <MaIcon name={"share"} size={24} color={colors.text} />,
                    onPress: () => Share.share({
                        url: `${Backend.getBaseUrl()}/track/${track.id}`
                    })
                } : undefined,
                track && track.type == "remote" ? {
                    text: `${isFavorite ? "Remove from" : "Add to"} Favorites`,
                    icon: <McIcon name={"heart"} size={24} color={colors.text} />,
                    onPress: () => User.favoriteTrack(track, !isFavorite)
                } : undefined,
                track ? {
                    text: `${local ? "Delete" : "Download"} Track`,
                    icon: <McIcon name={local ? "delete" : "download"} size={24} color={colors.text} />,
                    onPress: () => local ?
                        Downloads.remove(track as DownloadInfo) :
                        Downloads.download(track as RemoteInfo)
                } : undefined
            ]}
            style={props.style}
            optionsStyle={{ width: 230 }}
        />
    );
}

export default TrackMenu;
