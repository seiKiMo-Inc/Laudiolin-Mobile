import React from "react";
import { TouchableHighlight, View } from "react-native";
import { Icon, Image } from "@rneui/base";

import TextTicker from "react-native-text-ticker";
import BasicText from "@components/common/BasicText";

import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { TrackStyle } from "@styles/TrackStyle";
import { TrackMenuStyle } from "@styles/MenuStyle";

import { TrackData } from "@backend/types";
import { download } from "@backend/audio";
import { favoriteTrack, favorites } from "@backend/user";
import { getIconUrl, openTrack, promptPlaylistTrackAdd } from "@app/utils";

interface IProps {
    track: TrackData;
    padding?: number;
    onClick?: (track: TrackData) => void;
}

class Track extends React.PureComponent<IProps, never> {
    constructor(props: IProps) {
        super(props);
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
                        <Image
                            style={TrackStyle.image}
                            source={{ uri: getIconUrl(track) }}
                            resizeMethod={"resize"}
                        />

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

                        <Menu style={{ position: "absolute", right: 0, top: 20 }}>
                            <MenuTrigger>
                                <Icon
                                    color={"white"}
                                    type="material" name={"more-vert"}
                                    containerStyle={TrackStyle.more}
                                />
                            </MenuTrigger>

                            <MenuOptions customStyles={{ optionsContainer: TrackMenuStyle.menu }}>
                                <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                            text={"Add to Playlist"} onSelect={() => promptPlaylistTrackAdd(track)} />
                                <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                            text={"Open Track Source"} onSelect={() => openTrack(track)} />
                                <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                            text={"Favorite Track"} onSelect={() => favoriteTrack(track, !favorites.includes(track))} />
                                <MenuOption customStyles={{ optionText: TrackMenuStyle.text }}
                                            text={"Download Track"} onSelect={() => download(track)} />
                            </MenuOptions>
                        </Menu>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

export default Track;
