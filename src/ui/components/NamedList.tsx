import { ReactElement } from "react";
import { StyleSheet, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import StyledText, { Size } from "@components/StyledText";

import Track from "@widgets/Track";
import BackButton from "@widgets/BackButton";
import PlaylistStripe from "@widgets/PlaylistStripe";

import { TrackInfo } from "@backend/types";

import { value } from "@style/Laudiolin";

const renderers: { [key: string]: (data: any, index: number) => ReactElement } = {
    tracks: (track: TrackInfo, index: number) => <Track style={{ marginBottom: 10 }} key={index} data={track} />,
    playlists: (playlist: any, index: number) => <PlaylistStripe style={{ marginBottom: 10 }} key={index} playlist={playlist} />
};

interface RouteParams<T> {
    title: string;
    render: string;

    items?: T[];
}

interface IProps {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
}

function NamedList<T>(props: IProps) {
    const { route, navigation } = props;
    const {
        title, render, items
    } = route.params as RouteParams<T>;

    const renderer = renderers[render] as (item: T, index: number) => ReactElement;

    return (
        <View style={style.NamedList}>
            <View style={style.NamedList_Header}>
                <BackButton navigation={navigation} />
                <StyledText text={title} size={Size.Subheader} bold />
            </View>

            <FlashList
                data={items}
                estimatedItemSize={100}
                renderItem={({ item, index }) => renderer(item, index)}
            />
        </View>
    );
}

export default NamedList;

const style = StyleSheet.create({
    NamedList: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        padding: value.padding,
        gap: 15,
        marginBottom: 50
    },
    NamedList_Header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    }
});
