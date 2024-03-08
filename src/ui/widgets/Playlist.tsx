import { ImageBackground, TouchableOpacity } from "react-native";

import StyledText, { Size } from "@components/StyledText";

import { PlaylistInfo } from "@backend/types";

import style from "@style/Playlist";

interface IProps {
    playlist: PlaylistInfo;
}

function Playlist({ playlist }: IProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={style.Playlist}
        >
            <ImageBackground
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
            </ImageBackground>
        </TouchableOpacity>
    );
}

export default Playlist;
