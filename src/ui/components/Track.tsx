import React from "react";
import { View } from "react-native";
import { Icon, Image } from "@rneui/base";

import TextTicker from "react-native-text-ticker";
import BasicText from "@components/common/BasicText";

import { TrackStyle } from "@styles/TrackStyle";
import { TrackData } from "@backend/types";

import { Gateway } from "@app/constants";

interface IProps {
    track: TrackData;
    padding?: number;
}

/**
 * Matches the icon URL to the correct proxy URL.
 * @param track The track to get the icon URL for.
 */
function getIconUrl(track: TrackData): string {
    let url = `${Gateway.url}/proxy/{ico}?from={src}`;

    // Match the icon URL to the correct proxy URL.
    const iconUrl = track.icon;
    let split = iconUrl.split("/");

    if (iconUrl.includes("i.ytimg.com")) {
        return url
            .replace("{ico}", split[4])
            .replace("{src}", "yt");
    }
    if (iconUrl.includes("i.scdn.co")) {
        return url
            .replace("{ico}", split[4])
            .replace("{src}", "spot");
    }

    return url;
}

class Track extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { track } = this.props;

        return (
            <View style={{ flexDirection: "row", paddingBottom: this.props.padding ?? 0 }}>
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

                <Icon
                    color={"white"}
                    type="material" name={"more-vert"}
                    containerStyle={TrackStyle.more}
                />
            </View>
        );
    }
}

export default Track;
