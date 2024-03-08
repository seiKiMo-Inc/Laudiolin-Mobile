import { useState } from "react";
import { Image, TextInput, View } from "react-native";

import { NavigationProp } from "@react-navigation/native";

import StyledButton from "@components/StyledButton";

import Player from "@backend/Player";
import { search } from "@backend/search";
import { blank_SearchResult, SearchResult } from "@backend/types";

interface IProps {
    navigation: NavigationProp<any>;
}

function TrackPlayground({ navigation }: IProps) {
    const [query, setQuery] = useState("hikaru nara");

    const [results, setResults] = useState<SearchResult>(blank_SearchResult);

    return (
        <View style={{ gap: 35 }}>
            <StyledButton
                text={"Go Back"}
                onPress={() => navigation.goBack()}
            />

            <View style={{ gap: 15 }}>
                <TextInput
                    style={{
                        color: "white", borderColor: "white", borderWidth: 1, width: "80%",
                        alignSelf: "center", textAlign: "center"
                    }}
                    onChange={e => setQuery(e.nativeEvent.text)}
                >
                    {query}
                </TextInput>

                {
                    results.top != null &&
                    <Image
                        src={results.top.icon}
                        style={{
                            width: 128, height: 128, alignSelf: "center",
                            borderRadius: 10
                        }}
                    />
                }
            </View>

            <StyledButton
                text={"Do Search"}
                onPress={async() => setResults(await search(query))}
            />

            {
                results.top != null &&
                <View>
                    <StyledButton
                        text={"Play Track"}
                        onPress={async() => Player.play(results.top!)}
                    />
                </View>
            }
        </View>
    );
}

export default TrackPlayground;
