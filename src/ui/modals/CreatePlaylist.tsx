// noinspection RequiredAttributes

import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";

import Toggle from "react-native-toggle-element";

import OrDivider from "@components/OrDivider";
import StyledText from "@components/StyledText";
import StyledModal from "@components/StyledModal";
import StyledButton from "@components/StyledButton";
import StyledTextInput from "@components/StyledTextInput";

import { colors, value } from "@style/Laudiolin";

interface IProps {
    visible: boolean;
    hide: () => void;
}

function CreatePlaylist(props: IProps) {
    const [name, setName] = useState("");
    const [isPrivate, setPrivate] = useState(true);
    const [cover, setCover] = useState<string | null>(null); // This is a Base64 image string.

    const [useImport, setImport] = useState(false);

    const [importUrl, setImportUrl] = useState("");

    return (
        <StyledModal
            visible={props.visible}
            onPressOutside={props.hide}
            style={style.CreatePlaylist}
            title={"Create Playlist"}
        >
            { useImport ? <>
                <StyledTextInput
                    default={"Playlist URL"}
                    defaultColor={colors.gray}
                    textStyle={style.CreatePlaylist_Text}
                    inputStyle={{ borderBottomColor: "transparent" }}
                    containerStyle={style.CreatePlaylist_Input}
                    onChange={setImportUrl}
                />

                <StyledButton
                    text={"Import"}
                    style={style.CreatePlaylist_Button}
                    buttonStyle={{ backgroundColor: colors.accent }}
                />

                <OrDivider />

                <StyledButton
                    text={"Create a Playlist"}
                    style={style.CreatePlaylist_Button}
                    buttonStyle={{ backgroundColor: colors.accent }}
                    onPress={() => setImport(false)}
                />
            </> : <>
                <View style={{
                    gap: 10,
                    width: "100%",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <StyledTextInput
                        default={"Playlist Name"}
                        defaultColor={colors.gray}
                        textStyle={style.CreatePlaylist_Text}
                        inputStyle={{ borderBottomColor: "transparent" }}
                        containerStyle={style.CreatePlaylist_Input}
                        onChange={setName}
                    />

                    <StyledButton
                        text={"Set Playlist Cover"}
                        style={style.CreatePlaylist_Button}
                        buttonStyle={{ backgroundColor: colors.accent }}
                        onPress={async () => {
                            const result = await launchImageLibraryAsync({
                                mediaTypes: MediaTypeOptions.Images,
                                allowsMultipleSelection: false,
                                allowsEditing: true,
                                base64: true,
                                aspect: [4, 3],
                                quality: 1,
                            });

                            if (!result.canceled) {
                                setCover(result.assets[0].base64 ?? "");
                            }
                        }}
                    />

                    <View style={style.CreatePlaylist_Toggle}>
                        <StyledText text={"Private Playlist?"} />
                        <Toggle
                            animationDuration={200}
                            value={isPrivate} onPress={() => setPrivate(!isPrivate)}
                            trackBar={{
                                ...style.CreatePlaylist_Toggle_Track,
                                activeBackgroundColor: colors.accent,
                                inActiveBackgroundColor: colors.gray
                            }}
                            thumbButton={{
                                ...style.CreatePlaylist_Toggle_Thumb,
                                activeBackgroundColor: "white",
                                inActiveBackgroundColor: "white"
                            }}
                        />
                    </View>
                </View>

                <StyledButton
                    text={"Create"}
                    style={style.CreatePlaylist_Button}
                    buttonStyle={{ backgroundColor: colors.accent }}
                />

                <OrDivider />

                <StyledButton
                    text={"Import a Playlist"}
                    style={style.CreatePlaylist_Button}
                    buttonStyle={{ backgroundColor: colors.accent }}
                    onPress={() => setImport(true)}
                />
            </> }
        </StyledModal>
    );
}

export default CreatePlaylist;

const style = StyleSheet.create({
    CreatePlaylist: {
        gap: 15,
        width: value.width * 0.8
    },
    CreatePlaylist_Input: {
        backgroundColor: colors.primary,
        borderRadius: 10
    },
    CreatePlaylist_Text: {
        textAlign: "center"
    },
    CreatePlaylist_Toggle: {
        width: "90%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    CreatePlaylist_Toggle_Track: {
        width: 50,
        height: 15
    },
    CreatePlaylist_Toggle_Thumb: {
        width: 20,
        height: 20
    },
    CreatePlaylist_Button: {
        width: "100%",
        borderRadius: 10
    }
});
