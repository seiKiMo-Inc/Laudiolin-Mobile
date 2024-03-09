import { StyleSheet, TouchableOpacity, View } from "react-native";

import EnIcon from "react-native-vector-icons/Entypo";

import { LinearGradient } from "expo-linear-gradient";
import FastImage from "react-native-fast-image";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import StyledText, { Size } from "@components/StyledText";

import { PlaylistInfo } from "@backend/types";

interface IProps {
    playlist: PlaylistInfo;
}

function PlaylistStripe(props: IProps) {
    const navigation: NavigationProp<any> = useNavigation();

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={style.PlaylistStripe}
            onPress={() => navigation.navigate("Playlist", { playlist: props.playlist })}
        >
            <LinearGradient
                start={[0.4, 0]} end={[1, 0]}
                colors={["#aaeeff", "transparent"]}
                style={style.PlaylistStripe_Gradient}
            >
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <FastImage
                        source={{ uri: props.playlist.icon }}
                        style={style.PlaylistStripe_Image}
                    />

                    <View style={style.PlaylistStripe_Info}>
                        <StyledText text={props.playlist.name}
                                    ticker bold size={Size.Subheader} />

                        <StyledText text={props.playlist.author} />
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => null}
                    style={{ alignSelf: "center" }}
                >
                    <EnIcon name={"dots-three-vertical"} size={24} color={"white"} />
                </TouchableOpacity>
            </LinearGradient>
        </TouchableOpacity>
    );
}

export default PlaylistStripe;

const style = StyleSheet.create({
    PlaylistStripe: {
        width: "100%",
        flexDirection: "row"
    },
    PlaylistStripe_Image: {
        width: 96,
        height: 96,
        borderRadius: 20
    },
    PlaylistStripe_Gradient: {
        flexDirection: "row",
        width: "100%",
        borderRadius: 20,
        justifyContent: "space-between",
    },
    PlaylistStripe_Info: {
        width: "60%",
        flexDirection: "column",
        justifyContent: "center"
    }
});
