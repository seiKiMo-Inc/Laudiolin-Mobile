// noinspection RequiredAttributes

import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { logger } from "react-native-logs";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import OrDivider from "@components/OrDivider";
import StyledModal from "@components/StyledModal";
import StyledToggle from "@components/StyledToggle";
import StyledButton from "@components/StyledButton";
import StyledTextInput from "@components/StyledTextInput";

import Backend from "@backend/backend";
import Playlist from "@backend/playlist";
import { pickIcon } from "@backend/utils";
import { useColor } from "@backend/stores";

import { value } from "@style/Laudiolin";

const log = logger.createLogger();

interface IProps {
    visible: boolean;
    hide: () => void;
}

function CreatePlaylist(props: IProps) {
    const navigation: NavigationProp<any> = useNavigation();

    const colors = useColor();

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
            onLayout={() => {
                // Reset to default values.
                setName("");
                setPrivate(true);
                setCover(null);
                setImport(false);
                setImportUrl("");
            }}
        >
            { useImport ? <>
                <StyledTextInput
                    default={"Playlist URL"}
                    defaultColor={colors.gray}
                    textStyle={style.CreatePlaylist_Text}
                    inputStyle={{ borderBottomColor: "transparent" }}
                    containerStyle={{
                        ...style.CreatePlaylist_Input,
                        backgroundColor: colors.primary
                    }}
                    onChange={setImportUrl}
                />

                <StyledButton
                    text={"Import"}
                    style={style.CreatePlaylist_Button}
                    buttonStyle={{ backgroundColor: colors.accent }}
                    onPress={async () => {
                        if (importUrl == "") return;

                        const [success, playlistId] = await Playlist.createPlaylist(importUrl);
                        if (success) {
                            props.hide();
                            navigation.navigate("Playlist", { playlistId });
                        }
                    }}
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
                            const result = await pickIcon();
                            if (!result.canceled) {
                                setCover(result.assets[0].base64 ?? "");
                            }
                        }}
                    />

                    <StyledToggle
                        value={isPrivate}
                        onPress={setPrivate}
                        title={"Private Playlist?"}
                    />
                </View>

                <StyledButton
                    text={"Create"}
                    style={style.CreatePlaylist_Button}
                    buttonStyle={{ backgroundColor: colors.accent }}
                    onPress={async () => {
                        if (name == "") return;

                        const [success, playlistId, playlist] = await Playlist.createPlaylist({
                            name, isPrivate,
                            description: "My wonderful playlist!",
                            icon: `${Backend.getBaseUrl()}/Playlist.png`,
                            tracks: []
                        });
                        if (success && playlist) {
                            cover && await Playlist.setPlaylistIcon(playlist, cover)

                            props.hide();
                            navigation.navigate("Playlist", { playlistId });
                        } else {
                            log.warn("Unable to create playlist.");
                        }
                    }}
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
        borderRadius: 10
    },
    CreatePlaylist_Text: {
        textAlign: "center"
    },
    CreatePlaylist_Button: {
        width: "100%",
        borderRadius: 10
    }
});
