import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { NavigationProp } from "@react-navigation/native";

import Track from "@widgets/Track";
import BackButton from "@widgets/BackButton";

import StyledText, { Size } from "@components/StyledText";

import useQueue from "@hooks/useQueue";
import useTrackIndex from "@hooks/useTrackIndex";

import { value } from "@style/Laudiolin";

interface IProps {
    navigation: NavigationProp<any>;
}

function Queue({ navigation }: IProps) {
    const queue = useQueue();
    const trackIndex = useTrackIndex();

    const listRef = useRef<FlashList<any>>(null);

    const scroll = () => {
        listRef.current?.scrollToIndex({
            index: trackIndex,
            animated: true,
            viewPosition: 0.1
        });
    };

    useEffect(() => {
        if (queue.length > 0) {
            setTimeout(() => scroll(), 150);
        }
    }, [queue, trackIndex]);

    return (
        <View
            style={style.Queue}
        >
            <View style={style.Queue_Header}>
                <BackButton navigation={navigation} />
                <StyledText text={"Queue"} size={Size.Subheader} bold />
            </View>

            <FlashList
                ref={listRef}
                data={queue}
                estimatedItemSize={100}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <Track style={{ paddingBottom: 10 }} data={item} key={index} />
                )}
            />
        </View>
    );
}

export default Queue;

const style = StyleSheet.create({
    Queue: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        padding: value.padding,
        gap: 15,
    },
    Queue_Header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    }
});
