import { memo, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import FaIcon from "react-native-vector-icons/FontAwesome";

import Track from "@widgets/Track";
import StyledTextInput from "@components/StyledTextInput";

import { search, tracks } from "@backend/search";
import { SearchResult } from "@backend/types";

import { useColor } from "@backend/stores";
import { value } from "@style/Laudiolin";

let searchTimeout: NodeJS.Timeout | null = null;

function Search() {
    const listRef = useRef<FlatList>(null);
    const colors = useColor();

    const [query, setQuery] = useState("");
    const [searchRes, setSearchRes] = useState<SearchResult | null>(null);

    useEffect(() => {
        setSearchRes(null);
        listRef.current?.scrollToOffset({ animated: true, offset: 0 });

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(async () => {
            setSearchRes(await search(query));
        }, 1e3);
    }, [query]);

    return (
        <View style={style.Search}>
            <StyledTextInput
                default={"Search"}
                defaultColor={colors.text}
                icon={<FaIcon size={24} name={"search"} color={colors.text} />}
                inputStyle={{
                    ...style.Search_Input,
                    borderColor: colors.text
                }}
                onChange={setQuery}
                onFinish={() => setQuery(query)}
            />

            <FlatList
                style={{ marginBottom: 80 }} // This prevents tracks from being cut off.
                ref={listRef}
                initialNumToRender={10}
                contentContainerStyle={style.Search_Results}
                data={searchRes ? tracks(searchRes) : []}
                renderItem={({ item, index }) => item && <Track key={index} data={item} />}
            />
        </View>
    );
}

export default memo(Search);

const style = StyleSheet.create({
    Search: {
        flexDirection: "column",
        padding: value.padding,
        gap: 15
    },
    Search_Input: {
        borderBottomWidth: 2,
        borderWidth: 2,

        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    Search_Results: {
        gap: 15
    }
});
