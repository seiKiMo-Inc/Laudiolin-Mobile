import React from "react";
import { TouchableHighlight, View } from "react-native";

import { Icon, Image } from "@rneui/base";
import FastImage from "react-native-fast-image";
import TextTicker from "react-native-text-ticker";
import BasicText from "@components/common/BasicText";

import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { TrackStyle } from "@styles/WidgetStyle";
import { TrackMenuStyle } from "@styles/MenuStyle";

import type { Playlist, TrackData } from "@backend/types";
import emitter from "@backend/events";
import { getIconPath } from "@backend/fs";
import { downloadTrack, deleteTrack } from "@backend/audio";
import { favoriteTrack, loadPlaylists, favorites, playlists } from "@backend/user";
import { getIconUrl, openTrack, promptPlaylistTrackAdd } from "@app/utils";
import { removeTrackFromPlaylist } from "@backend/playlist";

import { console } from "@app/utils";

interface IProps {
    track: TrackData;

    playlist?: Playlist;
    local?: boolean;

    padding?: number;
    onClick?: (track: TrackData) => void;
}

interface IState {
    local: boolean;
}

class Track extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            local: true
        };
    }

    /**
     * Removes this track from the playlist.
     */
    async removeFromPlaylist(): Promise<void> {
        const { track, playlist } = this.props;
        if (!playlist) return;

        // Get the index of the track.
        const index = playlist.tracks.findIndex(t => t.id == track.id);
        if (index == -1) return;

        // Remove the track from the playlist.
        removeTrackFromPlaylist(playlist.id ?? "", index)
            .then(async () => {
                // Reload the playlists.
                await loadPlaylists();
                // Emit an event to update the playlist.
                emitter.emit("reloadPlaylist", playlists.find(p => p.id == playlist.id));
            })
            .catch(err => console.error(err));
    }

    render() {
        const { track } = this.props;

        return (
            <View style={{
                paddingBottom: this.props.padding ?? 0,
            }}>
                <TouchableHighlight
                    underlayColor={"transparent"}
                    style={{ borderRadius: 20 }}
                    onPress={() => this.props.onClick?.(track)}
                >
                    <View style={{ flexDirection: "row" }}>
                        {
                            this.state.local ?
                                <Image
                                    style={TrackStyle.image}
                                    source={{ uri: `file://${getIconPath(track)}` }}
                                    onError={() => this.setState({ local: false })}
                                    resizeMode={"cover"}
                                />
                                :
                                <FastImage
                                    style={TrackStyle.image}
                                    source={{ uri: getIconUrl(track) }}
                                    resizeMode={"cover"}
                                />
                        }

                        <View style={TrackStyle.text}>
                            <TextTicker
                                style={TrackStyle.title}
                                loop duration={5000}
                            >
                                {track.title}
                            </TextTicker>

                            <BasicText
                                text={track.artist}
                                style={TrackStyle.artist}
                                numberOfLines={1}
                            />
                        </View>

                        <Menu style={{ position: "absolute", right: 0, top: 7 }}>
                            <MenuTrigger>
                                <Icon
                                    color={"white"}
                                    type="material" name={"more-vert"}
                                    containerStyle={TrackStyle.more}
                                />
                            </MenuTrigger>

                            <MenuOptions customStyles={{ optionsContainer: TrackMenuStyle.menu }}>
                                {
                                    this.props.playlist == null ?
                                        <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                                    text={"Add to Playlist"} onSelect={() => promptPlaylistTrackAdd(track)} />
                                        :
                                        <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                                    text={"Remove from Playlist"} onSelect={() => this.removeFromPlaylist()} />
                                }

                                <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                            text={"Open Track Source"} onSelect={() => openTrack(track)} />
                                <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                            text={"Favorite Track"} onSelect={() => favoriteTrack(track, !favorites.includes(track))} />

                                {
                                    this.props.local ?
                                        <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                                    text={"Delete Track"} onSelect={() => deleteTrack(track)} />
                                        :
                                        <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                                    text={"Download Track"} onSelect={() => downloadTrack(track)} />
                                }
                            </MenuOptions>
                        </Menu>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

export default Track;
