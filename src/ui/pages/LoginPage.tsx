import React from "react";
import { View, ImageBackground } from "react-native";

import WebView, { WebViewNavigation } from "react-native-webview";
import BasicButton from "@components/common/BasicButton";
import BasicText from "@components/common/BasicText";

import { LoginPageStyle } from "@styles/PageStyles";

import * as settings from "@backend/settings";
import { navigate } from "@backend/navigation";
import { getLoginUrl, login } from "@backend/user";

import { console } from "@app/utils";

interface IState {
    showLogin: boolean;
    webViewUrl: string;
}

class SearchPage extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            showLogin: false,
            webViewUrl: ""
        };
    }

    /**
     * Changes the state to show the login page.
     */
    login(): void {
        this.setState({
            showLogin: true,
            webViewUrl: getLoginUrl()
        });
    }

    /**
     * Sends the user to the home page.
     */
    async ignoreLogin(): Promise<void> {
        // Set the user as not authenticated.
        await settings.save("authenticated", "guest");

        // Navigate to the home page.
        navigate("Home");
        this.setState({ showLogin: false });
    }

    /**
     * Invoked when the webview site changes.
     */
    onSiteChange(navi: WebViewNavigation): void {
        const { url } = navi; // Extract the URL.

        // Check if the URL is the redirect URL.
        if (url.includes("/handoff?code=")) {
            // Pull the code from the URL.
            const code = url.split("/handoff?code=")[1]
                .split("&")[0];
            // Login with the account.
            login(code)
                .then(async () => {
                    // Save the user's token.
                    await settings.setToken(code);
                    // Set the user as authenticated.
                    await settings.save("authenticated", "discord");

                    // Navigate to the home page.
                    navigate("Home");
                    this.setState({ showLogin: false });
                })
                .catch(err => console.error(err));
        } else if (url.includes("?error=")) {
            // Remove the login page.
            this.setState({ showLogin: false });
            return;
        }
    }

    render() {
        return !this.state.showLogin ? (
            <>
                <View style={LoginPageStyle.top}>
                    <BasicButton text={"Log in with Discord"}
                                 color={"#5b67af"} bold={true}
                                 width={300} height={40} radius={10}
                                 transform={"uppercase"}
                                 press={() => this.login()}
                    />
                </View>

                <View style={LoginPageStyle.bottom}>
                    <ImageBackground
                        source={require("../../../resources/images/icon-transparent.png")}
                        style={LoginPageStyle.image}
                    />

                    <View style={{ zIndex: 1 }}>
                        <BasicButton text={"Continue as Guest"}
                                     color={"#FFFFFF"} outline={"#5b67af"}
                                     width={300} height={40} radius={10}
                                     transform={"uppercase"} bold={true}
                                     press={() => this.ignoreLogin()}
                        />
                    </View>

                    <View style={{ paddingTop: 17 }}>
                        <BasicText text={"Logging in with Discord lets you create playlists, like \n" +
                            "songs, connect with friends and more!"} style={{ textAlign: "center" }} />
                    </View>
                </View>
            </>
        ) : (
            <WebView
                source={{ uri: this.state.webViewUrl }}
                onNavigationStateChange={navi => this.onSiteChange(navi)}
            />
        );
    }
}

export default SearchPage;
