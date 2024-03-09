import { ReactElement } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { NavigationProp, RouteProp } from "@react-navigation/native";

import StyledText, { Size } from "@components/StyledText";

import Track from "@widgets/Track";
import BackButton from "@widgets/BackButton";
import PlaylistStripe from "@widgets/PlaylistStripe";

import { TrackInfo } from "@backend/types";

import { value } from "@style/Laudiolin";

const renderers: { [key: string]: (data: any) => ReactElement } = {
    tracks: (track: TrackInfo) => <Track data={track} />,
    playlists: (playlist: any) => <PlaylistStripe playlist={playlist} />
};

interface RouteParams<T> {
    title: string;

    items: T[];
    render: string;
}

interface IProps {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
}

function NamedList<T>(props: IProps) {
    const { route, navigation } = props;
    const { title, items, render } = route.params as RouteParams<T>;

    const renderer = renderers[render] as (item: T) => ReactElement;

    return (
        <View style={style.NamedList}>
            <View style={style.NamedList_Header}>
                <BackButton navigation={navigation} />
                <StyledText text={title} size={Size.Subheader} bold />
            </View>

            <FlatList
                data={items}
                contentContainerStyle={style.NamedList_List}
                renderItem={({ item }) => renderer(item)}
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
    },
    NamedList_List: {
        flexDirection: "column",
        gap: 10
    }
});
