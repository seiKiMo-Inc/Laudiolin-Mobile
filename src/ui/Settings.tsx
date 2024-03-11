import { ReactElement, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { Overlay } from "@rneui/base";
import FastImage from "react-native-fast-image";

import StyledButton from "@components/StyledButton";
import StyledText, { Size } from "@components/StyledText";
import StyledTextInput from "@components/StyledTextInput";

import User from "@backend/user";
import { useGlobal, useSettings, useUser } from "@backend/stores";
import { validateAddress, validateSocket } from "@backend/utils";

import { colors, value } from "@style/Laudiolin";

interface SettingProps {
    title: string;
    type: "options" | "input";
    setting: string;

    options?: string[];

    parser?: (value: string) => any;
    reverseParser?: (value: any) => string;

    validate?: (value: string) => string | null;
}

function Setting(props: SettingProps) {
    const settings = useSettings();
    const { setting } = props

    const [showOverlay, setShowOverlay] = useState(false);
    const [newValue, setNewValue] = useState(settings.get(setting));
    const [error, setError] = useState("");

    let settingValue = settings.get(setting);
    if (typeof settingValue == "boolean") {
        settingValue = settingValue ? "Yes" : "No";
    }

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.5}
                style={{ flexDirection: "column" }}
                onPress={() => {
                    if (props.type == "options" && props.options) {
                        const options = props.options;
                        let currentValue = settings.get(setting);
                        if (props.reverseParser) {
                            currentValue = props.reverseParser(currentValue);
                        }
                        const index = (options.indexOf(currentValue) + 1) % options.length;

                        let value = options[index];
                        if (props.parser) {
                            value = props.parser(value);
                        }
                        settings.update(setting, value);
                    } else {
                        setShowOverlay(true);
                    }
                }}
            >
                <StyledText text={props.title} />
                <StyledText text={settingValue} size={Size.Footnote}
                            style={{ color: colors.gray }}
                />
            </TouchableOpacity>

            <Overlay
                isVisible={showOverlay}
                overlayStyle={{ backgroundColor: "transparent" }}
                onBackdropPress={() => setShowOverlay(false)}
            >
                <View style={style.Settings_Overlay}>
                    <StyledText text={props.title} bold size={Size.Subheader} />

                    <StyledTextInput
                        value={newValue}
                        autoCorrect={false}
                        textStyle={style.Settings_Input_Text}
                        inputStyle={style.Settings_Input}
                        errorMessage={error}
                        onChange={text => {
                            if (error != "") setError("");
                            setNewValue(text);
                        }}
                        onFinish={() => {
                            if (!newValue) {
                                setError("This field is required.");
                                return;
                            }

                            const result = props.validate?.(newValue);
                            if (props.validate && result == null) {
                                settings.update(setting, newValue);
                            } else if (result != null) {
                                setError(result);
                            }
                        }}
                    />
                </View>
            </Overlay>
        </>
    )
}

type Element = ReactElement | undefined;
interface SectionProps {
    title: string;
    children: Element | Element[];
}

function Section(props: SectionProps) {
    return (
        <View>
            <StyledText text={props.title} size={Size.Header} bold
                        style={{ marginBottom: 15 }} />

            <View style={{ gap: 15 }}>
                {props.children}
            </View>
        </View>
    );
}

function Settings() {
    const user = useUser();
    const global = useGlobal();

    const discordEnabled = user?.connections?.discord ?? undefined;

    return (
        <View style={style.Settings}>
            <StyledText text={"Settings"} size={Size.Subtitle} bold />

            <View style={style.Settings_Account}>
                {
                    user ?
                        <>
                            <View style={style.Settings_Details}>
                                <FastImage
                                    source={{ uri: user.avatar }}
                                    style={style.Settings_Icon}
                                />

                                <View style={{ flexDirection: "column" }}>
                                    <StyledText text={"Logged in as"} size={Size.Footnote} />
                                    <StyledText text={user.username ?? "someone?"} size={Size.Subheader} bold />
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => User.logOut()}>
                                <StyledText text={"Log out"} underlined size={Size.Footnote} />
                            </TouchableOpacity>
                        </>
                        :
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <StyledButton
                                text={"Login"}
                                style={style.Settings_Login}
                                buttonStyle={{ backgroundColor: colors.accent }}
                                onPress={() => global.setShowLoginPage(true)}
                            />
                        </View>
                }
            </View>

            <ScrollView
                style={{ marginBottom: `${user ? "50" : "40"}%` }}
                contentContainerStyle={{ gap: 30 }}
            >
                <Section title={"General"}>
                    <Setting title={"Search Engine"} type={"options"}
                             setting={"search.engine"}
                             options={["All", "YouTube", "Spotify"]}
                    />

                    <Setting title={"Use Search Accuracy"} type={"options"}
                             setting={"search.accuracy"}
                             options={["Yes", "No"]}
                             parser={value => value == "Yes"}
                             reverseParser={value => value ? "Yes" : "No"}
                     />
                </Section>

                <Section title={"User Interface"}>
                    <Setting title={"Color Palette"} type={"options"}
                             setting={"ui.color_theme"}
                             options={["Light", "Dark"]}
                    />
                </Section>

                <Section title={"System"}>
                    <Setting title={"Broadcast Current Song"} type={"options"}
                             setting={"system.broadcast_listening"}
                             options={["Nobody", "Friends", "Everyone"]}
                    />

                    {
                        discordEnabled ?
                        <Setting title={"Discord Rich Presence Type"} type={"options"}
                                 setting={"system.presence"}
                                 options={["Generic", "Simple", "Detailed", "None"]}
                        /> : undefined
                    }

                    <Setting title={"Server Address"} type={"input"}
                             setting={"system.server"}
                             validate={validateAddress}
                    />

                    <Setting title={"Gateway Address"} type={"input"}
                             setting={"system.gateway"}
                             validate={validateSocket}
                    />
                </Section>
            </ScrollView>
        </View>
    );
}

export default Settings;

const style = StyleSheet.create({
    Settings: {
        padding: value.padding
    },
    Settings_Account: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 30,
        paddingBottom: 30,
    },
    Settings_Login: {
        width: "50%",
        borderRadius: 10,
    },
    Settings_Icon: {
        width: 64,
        height: 64,
        borderRadius: 100,
    },
    Settings_Details: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },
    Settings_Input: {
        minHeight: 0,
        borderBottomColor: "transparent"
    },
    Settings_Input_Text: {
        minHeight: 0,
        color: colors.gray,
        fontSize: Size.Footnote,
        textAlign: "center"
    },
    Settings_Overlay: {
        width: 250,
        height: 80,
        borderRadius: 25,
        backgroundColor: colors.secondary,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        padding: value.padding
    }
});
