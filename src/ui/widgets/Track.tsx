import { Image, View, TouchableOpacity } from "react-native";

import EnIcon from "react-native-vector-icons/Entypo";

import StyledText, { Size } from "@components/StyledText";

import Player from "@backend/player";
import { TrackInfo } from "@backend/types";

import style from "@style/Track";

interface IProps {
    data: TrackInfo;

    style?: any;
}

function Track(props: IProps) {
    const { data } = props;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={{
                ...style.Track,
                ...props.style
            }}
            onPress={() => Player.play(data)}
            onLongPress={() => console.log("Open Context Menu")}
        >
            <View style={style.Track_Container}>
                <Image
                    src={data.icon}
                    style={style.Track_Icon}
                />

                <View style={style.Track_Info}>
                    <StyledText text={data.title} />
                    <StyledText text={data.artist} size={Size.Footnote} />
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
