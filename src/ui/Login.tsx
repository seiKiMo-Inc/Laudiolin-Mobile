import { StyleSheet, View, Image } from "react-native";

import * as Linking from "expo-linking";
import { logger } from "react-native-logs";
import { openAuthSessionAsync } from "expo-web-browser";

import StyledButton from "@components/StyledButton";
import StyledText, { Size } from "@components/StyledText";

import User from "@backend/user";
import Backend from "@backend/backend";
import { useGlobal } from "@backend/stores";

import { colors, value } from "@style/Laudiolin";

const log = logger.createLogger();
const prompt = "Logging in with seiKiMo lets you create playlists, create a list of favorite songs, connect with friends, and more!";

function OrDivider() {
    return (
        <View style={style.Login_Divider}>
            <View style={{ borderBottomWidth: 1, borderColor: "white", width: "45%" }} />
            <StyledText text={"OR"} size={Size.Footnote} />
            <View style={{ borderBottomWidth: 1, borderColor: "white", width: "45%" }} />
        </View>
    );
}

/**
 * Opens a web browser to the login page.
 */
async function waitForLogin(onLogin: () => void) {
    const callbackUrl = Linking.createURL("/login", { scheme: "laudiolin" });

    try {
        const result = await openAuthSessionAsync(Backend.getLoginUrl(), callbackUrl);
        if (result.type == "success") {
            const redirectUrl = result.url;

            // Extract the ?token= part of the URL.
            const token = redirectUrl.split("?token=")[1];
            if (token) {
                await User.login(token);
                onLogin();
            } else {
                log.error("Failed to parse authentication token", redirectUrl);
            }
        } else if (result.type != "cancel") {
            log.error("Failed to authenticate", result);
        }
    } catch (error) {
        log.error("Failed to authenticate", error);
    }
}

function Login() {
    const global = useGlobal();

    return (
        <View style={style.Login}>
            <View style={{ ...style.Login, zIndex: 1 }}>
                <View style={style.Login_Actions}>
                    <StyledButton text={"Login with seiKiMo!"}
                                  style={style.Login_Button}
                                  buttonStyle={{ backgroundColor: colors.accent }}
                                  onPress={() => waitForLogin(() => global.setShowLoginPage(false))}
                    />
                    <OrDivider />
                    <StyledButton text={"Continue as a Guest"}
                                  style={style.Login_Button}
                                  buttonStyle={{
                                      backgroundColor: "transparent",
                                      borderColor: colors.contrast,
                                      borderWidth: 1,
                                      borderRadius: 10
                                  }}
                                  onPress={() => global.setShowLoginPage(false)}
                    />
                </View>

                <StyledText text={prompt} lines={3} size={Size.Footnote}
                            style={{ textAlign: "center" }} />
            </View>

            <Image
                style={{
                    position: "absolute",
                    opacity: 0.2,
                    bottom: 0,
                    zIndex: 0
                }}
                source={require("@assets/background.png")}
            />
        </View>
    );
}

export default Login;

const style = StyleSheet.create({
    Login: {
        padding: value.padding,
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 15
    },
    Login_Actions: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        gap: 30
    },
    Login_Button: {
        borderRadius: 10,
        width: "90%"
    },
    Login_Divider: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    }
});
