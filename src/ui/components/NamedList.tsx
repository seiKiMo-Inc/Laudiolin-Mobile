import { ReactElement } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { NavigationProp, RouteProp } from "@react-navigation/native";

import StyledText, { Size } from "@components/StyledText";

import Track from "@widgets/Track";
import BackButton from "@widgets/BackButton";
import PlaylistStripe from "@widgets/PlaylistStripe";

import { TrackInfo } from "@backend/types";
import { useQueue } from "@backend/player";

import { value } from "@style/Laudiolin";

const renderers: { [key: string]: (data: any, index: number) => ReactElement } = {
    tracks: (track: TrackInfo, index: number) => <Track key={index} data={track} />,
    playlists: (playlist: any, index: number) => <PlaylistStripe key={index} playlist={playlist} />
};

const fetchers: { [key: string]: () => any } = {
    queue: useQueue
};

interface RouteParams<T> {
    title: string;
    render: string;
    renderLimit?: number | undefined;

    items?: T[];
    fetcher?: string;
}

interface IProps {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
}

function NamedList<T>(props: IProps) {
    const { route, navigation } = props;
    const {
        title, render, items: providedItems,
        fetcher, renderLimit
    } = route.params as RouteParams<T>;

    const renderer = renderers[render] as (item: T, index: number) => ReactElement;

    let items = fetcher ? fetchers[fetcher]() : providedItems;
    if (Array.isArray("items") && "values" in items) {
        items = items.values();
    }

    return (
        <View style={style.NamedList}>
            <View style={style.NamedList_Header}>
                <BackButton navigation={navigation} />
                <StyledText text={title} size={Size.Subheader} bold />
            </View>

            <FlatList
                data={items}
                initialNumToRender={renderLimit}
                contentContainerStyle={style.NamedList_List}
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
    },
    NamedList_List: {
        flexDirection: "column",
        gap: 10
    }
});
