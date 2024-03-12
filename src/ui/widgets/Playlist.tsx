import { TouchableOpacity } from "react-native";

import FastImage from "react-native-fast-image";

import StyledText, { Size } from "@components/StyledText";

import { PlaylistInfo } from "@backend/types";

import style from "@style/Playlist";

interface IProps {
    playlist: PlaylistInfo;
    onPress?: () => void;
}

function Playlist({ playlist, onPress }: IProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={style.Playlist}
            onPress={onPress}
        >
            <FastImage
                source={{ uri: playlist.icon }}
                style={style.Playlist_Image}
            >
                <StyledText
                    bold
                    lines={3}
                    size={Size.Text}
                    text={playlist.name}
                    style={style.Playlist_Text}
                />
            </FastImage>
        </TouchableOpacity>
    );
}

export default Playlist;
