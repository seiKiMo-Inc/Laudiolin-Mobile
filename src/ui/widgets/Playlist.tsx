import { TouchableOpacity, StyleSheet } from "react-native";

import FastImage from "react-native-fast-image";

import StyledText, { Size } from "@components/StyledText";

import { toIconUrl } from "@backend/utils";

interface IProps {
    playlist: { icon: string; name: string; };
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
                source={{
                    uri: toIconUrl(playlist.icon),
                    cache: FastImage.cacheControl.web
                }}
                style={style.Playlist_Image}
            >
                <StyledText
                    bold
                    lines={3}
                    size={Size.Text}
                    text={playlist.name}
                    style={{
                        ...style.Playlist_Text,
                        color: "white"
                    }}
                />
            </FastImage>
        </TouchableOpacity>
    );
}

export default Playlist;

const style = StyleSheet.create({
    Playlist: {
        width: 136, height: 136,
        borderRadius: 20,
        overflow: "hidden",
    },
    Playlist_Image: {
        width: "100%", height: "100%",
    },
    Playlist_Text: {
        position: "absolute",
        bottom: 0,
        padding: 10
    }
});
