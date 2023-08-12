import React from "react";
import { View, ImageBackground, Linking } from "react-native";

import WebView, { WebViewNavigation } from "react-native-webview";
import BasicButton from "@components/common/BasicButton";
import BasicText from "@components/common/BasicText";
import { ScreenWidth } from "@rneui/base";

import { LoginPageStyle } from "@styles/PageStyles";

import * as settings from "@backend/settings";
import { navigate } from "@backend/navigation";
import { getLoginUrl, login } from "@backend/user";

import { console } from "@app/utils";

interface IState {
    showCode: boolean;
    showLogin: boolean;
    webViewUrl: string;
}

class SearchPage extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            showCode: false,
            showLogin: false,
            webViewUrl: ""
        };
    }

    /**
     * Changes the state to show the login page.
     */
    login(): void {
        Linking.openURL(getLoginUrl())
            .catch(err => console.error(err));
    }

    /**
     * Prompts the user for an authorization code.
     */
    authCode(): void {
        this.setState({
            showCode: true,
            showLogin: false
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
            <View style={LoginPageStyle.container}>
                <ImageBackground
                    source={require("../../../resources/images/icon-transparent.png")}
                    style={LoginPageStyle.image}
                />


                <BasicButton text={"Log in with seiKiMo"}
                             color={"#5b67af"}
                             transform={"uppercase"} bold={true}
                             width={300} height={40} radius={10}
                             press={() => this.login()}
                             hold={() => this.authCode()}
                />

                <BasicText text={"OR"} style={{ color: "#FFFFFF80", fontWeight: "bold" }} />

                <BasicButton text={"Continue as Guest"}
                             button={{ alignSelf: "center" }}
                             color={"#FFFFFF00"} outline={"#5b67af"}
                             width={300} height={40} radius={10}
                             transform={"uppercase"} bold={true}
                             press={() => this.ignoreLogin()}
                />

                <BasicText text={"Logging in lets you create playlists, like songs, connect with friends and more!"}
                             style={{ width: ScreenWidth, maxWidth: "90%", alignSelf: "center", textAlign: "center"}} />
            </View>

        ) : (
            <WebView
                source={{ uri: this.state.webViewUrl }}
                onNavigationStateChange={navi => this.onSiteChange(navi)}
            />
        );
    }
}

export default SearchPage;
