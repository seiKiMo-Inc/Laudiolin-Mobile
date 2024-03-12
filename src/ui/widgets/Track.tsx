import { View, TouchableOpacity } from "react-native";

import FastImage from "react-native-fast-image";
import EnIcon from "react-native-vector-icons/Entypo";

import StyledText, { Size } from "@components/StyledText";

import Player from "@backend/player";
import { artist } from "@backend/search";
import { PlaylistInfo, TrackInfo } from "@backend/types";

import style from "@style/Track";

interface IProps {
    data: TrackInfo;
    playlist?: PlaylistInfo;

    style?: any;
}

function Track(props: IProps) {
    const { data, playlist } = props;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={{
                ...style.Track,
                ...props.style
            }}
            onPress={() => Player.play(data, { playlist })}
            onLongPress={() => console.log("Open Context Menu")}
        >
            <View style={style.Track_Container}>
                <FastImage
                    source={{ uri: data.icon }}
                    style={style.Track_Icon}
                />

                <View style={style.Track_Info}>
                    <StyledText style={style.Track_Title} text={data.title}
                                ticker={data.title.length > 25} />
                    <StyledText text={artist(data)} size={Size.Footnote} />
                </View>
            </View>

            <EnIcon
                name={"dots-three-vertical"}
                size={16} style={style.Track_ContextMenu}
                onPress={() => console.log("Open Context Menu")}
            />
        </TouchableOpacity>
    );
}

export default Track;
