import { ReactElement } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import { FlashList } from "@shopify/flash-list";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import StyledText, { Size } from "@components/StyledText";

import Track from "@widgets/Track";
import BackButton from "@widgets/BackButton";
import PlaylistStripe from "@widgets/PlaylistStripe";

import Downloads from "@backend/downloads";
import { useColor } from "@backend/stores";
import { TrackInfo } from "@backend/types";

import { value } from "@style/Laudiolin";

const renderers: { [key: string]: (data: any, index: number) => ReactElement } = {
    tracks: (track: TrackInfo) => <Track style={{ marginBottom: 10 }} key={track.id} data={track} />,
    playlists: (playlist: any) => <PlaylistStripe style={{ marginBottom: 10 }} key={playlist.id} playlist={playlist} />
};

const actions: { [key: string]: () => void } = {
    downloads: () => Downloads.deleteAll()
};

interface RouteParams<T> {
    title: string;
    render: string;

    items?: T[];
    action?: string;
}

interface IProps {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
}

function NamedList<T>(props: IProps) {
    const safeArea = useSafeAreaInsets();

    const color = useColor();

    const { route, navigation } = props;
    const {
        title, render, items, action
    } = route.params as RouteParams<T>;

    const renderer = renderers[render] as (item: T, index: number) => ReactElement;

    return (
        <View style={{
            paddingTop: value.padding + safeArea.top,
            ...style.NamedList
        }}>
            <View style={{
                ...style.NamedList_Header,
                justifyContent: "space-between"
            }}>
                <View style={style.NamedList_Header}>
                    <BackButton navigation={navigation} />
                    <StyledText text={title} size={Size.Subheader} bold />
                </View>

                { action && (
                    <TouchableOpacity onPress={() => {
                        actions[action]();
                        navigation.goBack();
                    }}>
                        <FontAwesome5Icon name={"trash"} size={20} color={color.red} />
                    </TouchableOpacity>
                ) }
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
