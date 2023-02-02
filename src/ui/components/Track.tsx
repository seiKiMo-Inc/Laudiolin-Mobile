import React from "react";
import { TouchableHighlight, View } from "react-native";
import { Icon, Image } from "@rneui/base";

import TextTicker from "react-native-text-ticker";
import BasicText from "@components/common/BasicText";

import { TrackStyle } from "@styles/TrackStyle";
import { TrackData } from "@backend/types";
import { getIconUrl } from "@app/utils";

interface IProps {
    track: TrackData;
    padding?: number;
    onClick?: (track: TrackData) => void;
}

class Track extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { track } = this.props;

        return (
            <TouchableHighlight
                onPress={() => this.props.onClick?.(track)}
            >
                <View style={{
                    flexDirection: "row",
                    paddingBottom: this.props.padding ?? 0
                }}>
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
            </TouchableHighlight>
        );
    }
}

export default Track;
