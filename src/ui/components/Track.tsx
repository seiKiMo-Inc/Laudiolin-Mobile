import React from "react";
import { TouchableHighlight, View } from "react-native";
import { Icon, Image } from "@rneui/base";

import TextTicker from "react-native-text-ticker";
import BasicText from "@components/common/BasicText";

import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import { TrackStyle } from "@styles/TrackStyle";
import { TrackData } from "@backend/types";
import { download } from "@backend/audio";
import { getIconUrl, openTrack } from "@app/utils";

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
                paddingBottom: this.props.padding ?? 0
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
                            />
                        </View>

                        <Menu style={{ justifyContent: "center" }}>
                            <MenuTrigger>
                                <Icon
                                    color={"white"}
                                    type="material" name={"more-vert"}
                                    containerStyle={TrackStyle.more}
                                />
                            </MenuTrigger>

                            <MenuOptions>
                                <MenuOption text={"Add to Playlist"} onSelect={() => console.log("a")} />
                                <MenuOption text={"Open Track Source"} onSelect={() => openTrack(track)} />
                                <MenuOption text={"Download Track"} onSelect={() => download(track)} />
                            </MenuOptions>
                        </Menu>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

export default Track;
