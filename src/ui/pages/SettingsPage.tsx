import React from "react";
import { ScrollView, View } from "react-native";

import BasicText from "@components/common/BasicText";
import MixedText from "@components/common/MixedText";

import { Image } from "@rneui/base";

import { SettingsPageStyle } from "@styles/PageStyles";

class SearchPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <ScrollView contentContainerStyle={SettingsPageStyle.container}>
                <BasicText
                    text={"Settings"}
                    style={SettingsPageStyle.title}
                />

                <View style={SettingsPageStyle.userContainer}>
                    <View style={{ paddingRight: 10 }}>
                        <Image
                            style={SettingsPageStyle.userImage}
                            source={{uri: "https://cdn.discordapp.com/avatars/692733693827088454/53f6f209e03bf7f912e70b90b56fa039.webp?size=48"}}
                        />
                    </View>
                    <View style={{ justifyContent: "center" }}>
                        <BasicText text={"Logged in as"} style={{ fontSize: 13 }} />
                        <MixedText
                            first={"natsu"} second={"#4700"}
                            firstStyle={{ ...SettingsPageStyle.userText, color: "white" }}
                            secondStyle={{ ...SettingsPageStyle.userText, color: "#888787" }}
                        />
                    </View>
                    <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
                        {/* TODO: Move this to center with the above text. */}
                        {/* TODO: Change this to a clickable text object. */}
                        <BasicText text={"Log out"} style={SettingsPageStyle.logOut} />
                    </View>
                </View>

                <View style={SettingsPageStyle.settingsContainer}>
                    {/* TODO: Replace with a forEach loop. */}
                    <View style={{ paddingBottom: 20 }}>
                        <BasicText
                            text={"General"}
                            style={SettingsPageStyle.category}
                        />

                        {/* TODO: Replace with a forEach loop. */}
                        <View style={SettingsPageStyle.configure}>
                            <BasicText text={"Downloads Folder"} style={SettingsPageStyle.setting} />
                            <BasicText text={"C:\\Users\\natsu\\Downloads"} style={SettingsPageStyle.value} />
                        </View>

                        <View style={SettingsPageStyle.configure}>
                            <BasicText text={"Preferred Search Engine"} style={SettingsPageStyle.setting} />
                            <BasicText text={"YouTube"} style={SettingsPageStyle.value} />
                        </View>
                    </View>
                    <View style={{ paddingBottom: 20 }}>
                        <BasicText
                            text={"UI Settings"}
                            style={SettingsPageStyle.category}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default SearchPage;
