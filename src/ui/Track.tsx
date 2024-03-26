import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import FeIcon from "react-native-vector-icons/Feather";
import McIcon from "react-native-vector-icons/MaterialCommunityIcons";

import FastImage from "react-native-fast-image";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import BackButton from "@widgets/BackButton";
import StyledButton from "@components/StyledButton";
import StyledText, { Size } from "@components/StyledText";

import Backend from "@backend/backend";
import { toIconUrl } from "@backend/utils";
import { useColor, useFavorites } from "@backend/stores";
import { TrackInfo } from "@backend/types";

import { value } from "@style/Laudiolin";

interface RouteParams {
    id?: string;
    track?: TrackInfo;
}

interface IProps {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
}

function Track({ navigation, route }: IProps) {
    const { id, track: _track } = route.params as RouteParams;

    const colors = useColor();

    const favorites = Object.values(useFavorites());

    const [track, setTrack] = useState<TrackInfo | undefined>(_track);

    const isFavorite = favorites.some(f => f.id == id);

    useEffect(() => {
        if (!track && id) {
            Backend.fetchTrack(id).then(setTrack);
        }
    }, [route]);

    return (
        <View style={style.Track}>
            <BackButton navigation={navigation} />

            <View style={style.Track_Info}>
                <FastImage
                    source={{ uri: toIconUrl(track?.icon) }}
                    style={style.Track_Cover}
                />

                <View style={style.Track_Details}>
                    <StyledText text={track?.title ?? "No Title"} bold size={Size.Subheader} />
                    <StyledText text={track?.artist ?? "Unknown"} />
                </View>
            </View>

            <View style={style.Track_Actions}>
                <View style={style.Track_Pair}>
                    <StyledButton
                        text={"Play"}
                        style={style.Track_Button}
                    />

                    <TouchableOpacity
                        activeOpacity={0.7}
                    >
                        <FeIcon name={"share"} size={28} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                    >
                        <McIcon name={"heart"} size={32}
                                color={isFavorite ? colors.red : colors.text}
                        />
                    </TouchableOpacity>
                </View>

                <View style={style.Track_Pair}>
                    <StyledButton
                        text={"Add to Playlist"}
                        style={style.Track_Button}
                    />
                </View>
            </View>

            <ScrollView
                style={style.Track_Lyrics}
                showsVerticalScrollIndicator={false}
            >
                <StyledText text={"No lyrics found!"} />
            </ScrollView>
        </View>
    );
}

export default Track;

const style = StyleSheet.create({
    Track: {
        padding: value.padding,
        width: "100%",
        height: "100%",
        gap: 15
    },
    Track_Info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15
    },
    Track_Cover: {
        width: 150,
        height: 150,
        borderRadius: 10
    },
    Track_Details: {
        flexDirection: "column",
        gap: 5
    },
    Track_Actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    Track_Pair: {
        alignItems: "center",
        flexDirection: "row",
        gap: 10
    },
    Track_Lyrics: {
        height: 200
    },
    Track_Button: {
        borderRadius: 10,
    }
});
