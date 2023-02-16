import React from "react";
import { Dimensions, ScrollView, TouchableHighlight, View } from "react-native";
import { NavigationSwitchScreenProps } from "react-navigation";

import Hide from "@components/common/Hide";
import BasicText from "@components/common/BasicText";
import MixedText from "@components/common/MixedText";
import BasicModal from "@components/common/BasicModal";
import BasicButton from "@components/common/BasicButton";
import FadeInView from "@components/common/FadeInView";

import { Image } from "@rneui/base";

import { SettingsPageStyle } from "@styles/PageStyles";

import type { User, SettingType } from "@backend/types";
import * as settings from "@backend/settings";
import { navigate } from "@backend/navigation";
import { getCode, logout, userData } from "@backend/user";
import { connect, connected } from "@backend/gateway";
import { offlineSupport, isOffline } from "@backend/offline";

class Setting extends React.Component<
    {
        setting: string, type: SettingType, options?: string[]
        onUpdate?: (value: any) => void
    }, { value: string|boolean }
> {
    constructor(props: any) {
        super(props);

        this.state = {
            value: ""
        };
    }

    /**
     * Returns a string'ified value of the setting.
     */
    getValue(): string {
        switch(this.props.type) {
            case "select":
                const value = this.state.value as string;
                return value.length > 0 ? value : this.props.options?.[0] ?? "";
            case "boolean":
                return (this.state.value as boolean) ? "Enabled" : "Disabled";
            default:
                return "";
        }
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
                let index = options.findIndex(option => option == this.state.value as string);
                if (index == -1) index = 0;
                // Get the next option, or the first option if there is no next option.
                const next = options[index + 1] ?? options[0];
                // Set the next option.
                await settings.saveFromPath(this.props.setting, next);
                this.setState({ value: next });
                break;
            case "boolean":
                // Set the next option.
                await settings.saveFromPath(this.props.setting, !this.state.value);
                this.setState({ value: !this.state.value });
                break;
        }

        // Invoke the update callback.
        this.props.onUpdate?.(this.state.value);
    }

    render() {
        return (
            <View style={SettingsPageStyle.configure}>
                <BasicText text={settings.settingsKeys[this.props.setting]}
                           style={SettingsPageStyle.setting} />
                <BasicText text={this.getValue()}
                           style={SettingsPageStyle.value}
                           press={() => this.showInput()} />
            </View>
        );
    }
}

interface IState {
    user: User|null;

    code: string;
    showCode: boolean;
    showAuthModal: boolean;
}

class SearchPage extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            user: userData,
            code: "",
            showCode: false,
            showAuthModal: false
        };
    }

    /**
     * Reconnects to the gateway.
     */
    reconnect(): void {
        connect();
    }

    /**
     * Hides the auth code modal.
     */
    hideCodeModal(): void {
        this.setState({
            showAuthModal: false,
            showCode: false, code: ""
        });
    }

    /**
     * Shows the user's auth code.
     */
    async showAuthCode(): Promise<void> {
        this.setState({
            showCode: !this.state.showCode,
            code: !this.state.showCode ? (await getCode() ?? "") : ""
        });
    }

    render() {
        // Pull the user.
        const { user } = this.state;

        return (
            <FadeInView navigation={this.props.navigation as NavigationSwitchScreenProps["navigation"]}>
                <ScrollView contentContainerStyle={{ paddingLeft: 20, paddingTop: 20 }}>
                    <BasicText
                        text={"Settings"}
                        style={SettingsPageStyle.title}
                    />

                    <View style={SettingsPageStyle.userContainer}>
                        {
                            user != null ? (
                                <>
                                    <View style={{ paddingRight: 10 }}>
                                        <Image
                                            style={SettingsPageStyle.userImage}
                                            source={{ uri: user?.avatar ?? "" }}
                                            onLongPress={() => !isOffline && this.setState({ showAuthModal: true })}
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

                                    <Hide show={!isOffline}>
                                        <BasicText
                                            containerStyle={SettingsPageStyle.logOutContainer}
                                            text={"Log out"} style={SettingsPageStyle.logOut}
                                            press={async () => await logout()}
                                        />
                                    </Hide>
                                </>
                            ) : (
                                <View style={{ alignItems: "center", width: Dimensions.get("window").width - 20 }}>
                                    <BasicButton text={"Log in with Discord"}
                                                 color={"#5b67af"} bold={true}
                                                 width={200} height={40} radius={10}
                                                 transform={"uppercase"}
                                                 press={() => navigate("Login")}
                                    />
                                </View>
                            )
                        }
                    </View>

                    <View style={SettingsPageStyle.settingsContainer}>
                        <View style={{ paddingBottom: 20 }}>
                            <BasicText
                                text={"General"}
                                style={SettingsPageStyle.category}
                            />

                            {
                                !isOffline && (
                                    <>
                                        <Setting setting={"search.engine"} type={"select"}
                                                 options={["All", "YouTube", "Spotify"]} />
                                        <Setting setting={"system.offline"} type={"boolean"}
                                                 onUpdate={value => offlineSupport(value)} />
                                        { userData != null && <>
                                            <Setting setting={"system.broadcast_listening"} type={"select"}
                                                     options={["Nobody", "Friends", "Everyone"]} />
                                            <Setting setting={"system.presence"} type={"select"}
                                                     options={["Generic", "Simple", "None"]} />
                                        </> }
                                    </>
                                )
                            }
                        </View>

                        <View style={{ paddingBottom: 20 }}>
                            <BasicText
                                text={"User Interface"}
                                style={SettingsPageStyle.category}
                            />

                            <Setting setting={"ui.progress_fill"} type={"select"}
                                     options={["Solid", "Gradient"]} />
                        </View>
                    </View>

                    <View style={SettingsPageStyle.actionsContainer}>
                        <Hide show={!connected && !isOffline}>
                            <BasicButton
                                color={"#c75450"}
                                text={"Reconnect to Gateway"}
                                hold={() => this.reconnect()}
                            />
                        </Hide>
                    </View>

                    <BasicModal
                        title={"Authentication Code"} buttonText={"Close"}
                        showModal={this.state.showAuthModal}
                        onSubmit={() => this.hideCodeModal()}
                        onBackdropPress={() => this.hideCodeModal()}
                    >
                        <TouchableHighlight
                            underlayColor={"transparent"}
                            onPress={() => this.showAuthCode()}
                        >
                            <>
                                <BasicText text={`Press to ${this.state.showCode ? "hide" : "show"} code.`} />
                                <Hide show={this.state.showCode}>
                                    <BasicText text={`Authentication Code: ${this.state.code}`} />
                                </Hide>
                            </>
                        </TouchableHighlight>
                    </BasicModal>
                </ScrollView>
            </FadeInView>
        );
    }
}

export default SearchPage;
