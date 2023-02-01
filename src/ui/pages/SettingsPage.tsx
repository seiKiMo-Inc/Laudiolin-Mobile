import React from "react";
import { ScrollView, View } from "react-native";

import BasicText from "@components/common/BasicText";
import MixedText from "@components/common/MixedText";

import { Image } from "@rneui/base";

import { SettingsPageStyle } from "@styles/PageStyles";

import { User } from "@backend/types";
import { logout, userData } from "@backend/user";

interface IState {
    user: User|null;
}

class SearchPage extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            user: userData
        };
    }

    render() {
        // Check if the user is valid.
        if (this.state.user == null)
            return null;

        // Pull the user.
        const { user } = this.state;

        return (
            <ScrollView contentContainerStyle={{ paddingLeft: 20 }}>
                <BasicText
                    text={"Settings"}
                    style={SettingsPageStyle.title}
                />

                <View style={SettingsPageStyle.userContainer}>
                    <View style={{ paddingRight: 10 }}>
                        <Image
                            style={SettingsPageStyle.userImage}
                            source={{ uri: user?.avatar ?? "" }}
                        />
                    </View>
                    <View style={{ justifyContent: "center" }}>
                        <BasicText text={"Logged in as"} style={{ fontSize: 13 }} />
                        <MixedText
                            first={user?.username ?? ""} second={"#" + (user?.discriminator ?? "0000")}
                            firstStyle={{ ...SettingsPageStyle.userText, color: "white" }}
                            secondStyle={{ ...SettingsPageStyle.userText, color: "#888787" }}
                        />
                    </View>
                    <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
                        <BasicText
                            text={"Log out"} style={SettingsPageStyle.logOut}
                            press={async () => await logout()}
                        />
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
