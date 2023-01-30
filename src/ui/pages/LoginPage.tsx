import React from "react";
import { View, ImageBackground } from "react-native";

import BasicButton from "@components/common/BasicButton";
import BasicText from "@components/common/BasicText";

import { LoginPageStyle } from "@styles/PageStyles";

class SearchPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                <View style={LoginPageStyle.top}>
                    <BasicButton text={"Log in with Discord"}
                                 color={"#5b67af"} bold={true}
                                 width={300} height={40} radius={10}
                                 transform={"uppercase"}
                    />
                </View>

                <View style={LoginPageStyle.bottom}>
                    <BasicButton text={"Continue as Guest"}
                                 color={"#FFFFFF"} outline={"#5b67af"}
                                 width={300} height={40} radius={10}
                                 transform={"uppercase"} bold={true}
                    />
                    <View style={{ paddingTop: 17 }}>
                        <BasicText text={"Logging in with discord lets you create playlists, like \n" +
                            "songs, connect with friends and more!"} style={{ textAlign: "center" }} />
                    </View>
                </View>

                <ImageBackground
                    source={require("../../../resources/images/icon-transparent.png")}
                    style={LoginPageStyle.image}
                />
            </>
        );
    }
}

export default SearchPage;
