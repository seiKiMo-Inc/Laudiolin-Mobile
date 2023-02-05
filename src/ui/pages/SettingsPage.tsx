import React from "react";
import { ScrollView, View } from "react-native";

import BasicText from "@components/common/BasicText";
import MixedText from "@components/common/MixedText";

import { Image } from "@rneui/base";

import { SettingsPageStyle } from "@styles/PageStyles";

import * as settings from "@backend/settings";
import { logout, userData } from "@backend/user";
import type { User, SettingType } from "@backend/types";

class Setting extends React.Component<
    { setting: string, type: SettingType, options?: string[] }, { value: string }
> {
    constructor(props: any) {
        super(props);

        this.state = {
            value: ""
        };
    }

    async componentDidMount() {
        this.setState({ value: await settings.getFromPath(
            this.props.setting) ?? "" });
    }

    async showInput() {
        switch(this.props.type) {
            case "select":
                // Get the select options.
                const { options } = this.props;
                if (options == null) return;

                // Get the index of the current select option.
                const index = options.findIndex(option => option == this.state.value);
                if (index == -1) return;
                // Get the next option, or the first option if there is no next option.
                const next = options[index + 1] ?? options[0];
                // Set the next option.
                await settings.saveFromPath(this.props.setting, next);
                this.setState({ value: next });
                return;
        }
    }

    render() {
        return (
            <View style={SettingsPageStyle.configure}>
                <BasicText text={settings.settingsKeys[this.props.setting]}
                           style={SettingsPageStyle.setting} />
                <BasicText text={this.state.value}
                           style={SettingsPageStyle.value}
                           press={() => this.showInput()} />
            </View>
        );
    }
}

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
                    <View style={{ paddingBottom: 20 }}>
                        <BasicText
                            text={"General"}
                            style={SettingsPageStyle.category}
                        />

                        <Setting setting={"search.engine"} type={"select"}
                                 options={["All", "YouTube", "Spotify"]} />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default SearchPage;
