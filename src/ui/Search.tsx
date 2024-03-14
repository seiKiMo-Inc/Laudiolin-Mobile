import { memo, useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";

import FaIcon from "react-native-vector-icons/FontAwesome";

import Track from "@widgets/Track";
import StyledTextInput from "@components/StyledTextInput";

import { search, tracks } from "@backend/search";
import { SearchResult } from "@backend/types";

import style from "@style/Search";

let searchTimeout: NodeJS.Timeout | null = null;

function Search() {
    const listRef = useRef<FlatList>(null);

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
                defaultColor={"white"}
                icon={<FaIcon size={24} name={"search"} color={"white"} />}
                inputStyle={style.Search_Input}
                onChange={setQuery}
                onFinish={() => setQuery(query)}
            />

            <FlatList
                style={{ marginBottom: 80 }} // This prevents tracks from being cut off.
                ref={listRef}
                initialNumToRender={10}
                contentContainerStyle={style.Search_Results}
                data={searchRes ? tracks(searchRes) : []}
                renderItem={({ item }) => item && <Track key={item.id} data={item} />}
            />
        </View>
    );
}

export default memo(Search);
