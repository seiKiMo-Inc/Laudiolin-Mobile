import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { logger } from "react-native-logs";
import { getDocumentAsync, DocumentPickerAsset } from "expo-document-picker";

import FastImage from "react-native-fast-image";

import StyledText from "@components/StyledText";
import StyledModal from "@components/StyledModal";
import StyledButton from "@components/StyledButton";
import StyledTextInput from "@components/StyledTextInput";

import Downloads from "@backend/downloads";
import { useColor } from "@backend/stores";
import { pickIcon, sha256 } from "@backend/utils";

import { alert } from "@widgets/Alert";

const log = logger.createLogger();

interface IProps {
    opened: boolean;
    close: () => void;
}

function ImportTrack(props: IProps) {
    const colors = useColor();

    const [file, setFile] = useState<DocumentPickerAsset | null>(null);
    const [icon, setIcon] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string | undefined>(undefined);
    const [artist, setArtist] = useState<string | undefined>(undefined);

    return (
        <StyledModal
            visible={props.opened}
            onPressOutside={() => {
                props.close();
                setFile(null);
                setIcon(undefined);
                setTitle(undefined);
                setArtist(undefined);
            }}
            style={style.ImportTrack_Modal}
            title={"Import a Track"}
        >
            { !file ? <>
                <StyledButton
                    text={"Select a Song"}
                    onPress={async () => {
                        try {
                            const file = await getDocumentAsync({
                                type: "audio/*", copyToCacheDirectory: true
                            });

                            if (!file.canceled) {
                                setFile(file.assets[0]);
                            }
                        } catch (error) {
                            alert(`Error importing: ${error}`);
                            log.error("Error importing local file", error);
                        }
                    }}
                    style={{ borderRadius: 10 }}
                />
            </> : <View
                style={style.ImportTrack_Details}
            >
                <TouchableOpacity
                    style={{
                        ...style.ImportTrack_Cover,
                        backgroundColor: colors.gray
                    }}
                    onPress={async () => {
                        try {
                            const cover = await pickIcon();
                            setIcon(cover.assets?.[0].uri);
                        } catch (error) {
                            alert(`Error setting cover: ${error}`);
                            log.error("Error setting cover", error);
                        }
                    }}
                >
                    { icon ? (
                        <FastImage
                            source={{ uri: icon ?? "" }}
                            style={style.ImportTrack_Cover}
                        />
                    ) : (
                        <StyledText
                            text={"Select a Cover (press)"} lines={3}
                            style={{ textAlign: "center" }}
                        />
                    ) }
                </TouchableOpacity>

                <StyledText
                    ticker bold
                    text={file?.name ?? "No file selected"}
                />

                <StyledTextInput
                    default={"Track Title"}
                    onChange={setTitle}
                    textStyle={style.ImportTrack_Text}
                    containerStyle={{
                        ...style.ImportTrack_Input,
                        backgroundColor: colors.primary,
                    }}
                    inputStyle={{ width: "100%" }}
                />

                <StyledTextInput
                    default={"Track Artist"}
                    onChange={setArtist}
                    textStyle={style.ImportTrack_Text}
                    containerStyle={{
                        ...style.ImportTrack_Input,
                        backgroundColor: colors.primary
                    }}
                    inputStyle={{ width: "100%" }}
                />

                <StyledButton
                    text={"Import"}
                    style={{ borderRadius: 10 }}
                    onPress={async () => {
                        if (!await Downloads.import(file, {
                            type: "download",
                            encoded: true,
                            filePath: "",
                            artist: artist ?? "",
                            duration: 0,
                            icon: icon ?? "",
                            id: await sha256(file?.name, 16),
                            title: title ?? "",
                            url: ""
                        })) {
                            alert("Error importing track");
                        }

                        props.close();
                    }}
                />
            </View> }
        </StyledModal>
    );
}

export default ImportTrack;

const style = StyleSheet.create({
    ImportTrack_Modal: {
        gap: 10,
        width: "80%"
    },
    ImportTrack_Details: {
        width: "100%",
        alignItems: "center",
        gap: 10
    },
    ImportTrack_Cover: {
        width: 128,
        height: 128,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    ImportTrack_Input: {
        borderRadius: 10
    },
    ImportTrack_Text: {
        textAlign: "center"
    }
});
