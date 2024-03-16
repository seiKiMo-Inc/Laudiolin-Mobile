import { useState } from "react";
import { TextInput, View } from "react-native";

import { NavigationProp } from "@react-navigation/native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";

import Track from "@widgets/Track";
import StyledButton from "@components/StyledButton";

import { search } from "@backend/search";
import { TrackInfo } from "@backend/types";
import { first } from "@backend/utils";

import { useColor } from "@backend/stores";

const renderItem = ({ item, drag, isActive }: RenderItemParams<TrackInfo>) => (
    <ScaleDecorator>
        <Track style={{ marginBottom: 15 }} disabled={isActive} data={item} onHold={drag} />
    </ScaleDecorator>
);

interface IProps {
    navigation: NavigationProp<any>;
}

function TrackPlayground({ navigation }: IProps) {
    const colors = useColor();
    const [query, setQuery] = useState("hikaru nara");

    const [data, setData] = useState<TrackInfo[]>([]);

    return (
        <View style={{ gap: 35, padding: 15 }}>
            <StyledButton
                text={"Go Back"}
                onPress={() => navigation.goBack()}
            />

            <StyledButton
                text={"Do Search"}
                onPress={async() => {
                    const results = await search(query);
                    if (!results.top) return;

                    setData(first([results.top, ...results.results], 10));
                }}
            />

            <View style={{ gap: 15 }}>
                <TextInput
                    style={{
                        color: colors.text, borderColor: colors.text, borderWidth: 1, width: "80%",
                        alignSelf: "center", textAlign: "center"
                    }}
                    onChange={e => setQuery(e.nativeEvent.text)}
                >
                    {query}
                </TextInput>

                { data.length != 0 && (
                    <DraggableFlatList
                        data={data}
                        onDragEnd={({ data }) => setData(data)}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ flexDirection: "column" }}
                    />
                ) }
            </View>
        </View>
    );
}

export default TrackPlayground;
