import React from "react";
import { View } from "react-native";

import TextTicker from "react-native-text-ticker";
import BasicText from "@components/common/BasicText";
import BasicTextInput from "@components/common/BasicTextInput";

import { SearchPageStyle } from "@styles/PageStyles";
import { Icon, Image } from "@rneui/base";

class SearchPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View style={SearchPageStyle.container}>
                <View style={{ alignItems: "center" }}>
                    <BasicTextInput
                        default={"Search"}
                        textStyle={SearchPageStyle.searchText}
                        containerStyle={SearchPageStyle.searchContainer}
                        icon={<Icon
                            type="material" name={"search"}
                            iconStyle={{ color: "white", paddingBottom: 5, paddingLeft: 5 }}
                        />}
                    />
                </View>

                <View style={SearchPageStyle.results}>
                    <>
                        <Image
                            style={SearchPageStyle.resultImage}
                            source={{uri: "https://app.magix.lol/proxy/OSic91btFq36NI-XacUzV73Wa_LqfRtvBgGoOhLuIRemZ4YJs3xhbE1nrVqPaTpvo3g83dyaqo2HX2g=w544-h544-l90-rj?from=cart"}}
                        />
                        <View style={SearchPageStyle.resultText}>
                            <TextTicker
                                style={SearchPageStyle.resultTitle}
                                loop duration={5000}
                            >
                                {"Right Here I Stand"}
                            </TextTicker>
                            <BasicText
                                text={"Project Mons"}
                                style={SearchPageStyle.resultArtist}
                            />
                        </View>
                        <Icon
                            color={"white"}
                            type="material" name={"more-vert"}
                            containerStyle={SearchPageStyle.resultsMore}
                        />
                    </>
                </View>
            </View>
        );
    }
}

export default SearchPage;
