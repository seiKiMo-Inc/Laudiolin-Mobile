import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { logger } from "react-native-logs";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import StyledModal from "@components/StyledModal";
import StyledButton from "@components/StyledButton";
import StyledTextInput from "@components/StyledTextInput";

import Playlist from "@backend/playlist";
import { OwnedPlaylist } from "@backend/types";

import { colors, value } from "@style/Laudiolin";
import { pickIcon } from "@backend/utils";
import StyledToggle from "@components/StyledToggle";

const log = logger.createLogger();

interface IProps {
    playlist: OwnedPlaylist;
    visible: boolean;
    hide: () => void;
}

function EditPlaylist({ playlist, visible, hide }: IProps) {
    const navigation: NavigationProp<any> = useNavigation();

    const [newName, setNewName] = useState(playlist.name);
    const [newDescription, setNewDescription] = useState(playlist.description);
    const [isPrivate, setPrivate] = useState(playlist.isPrivate);
    const [newCover, setCover] = useState(playlist.icon);

    const [showFields, setShowFields] = useState(false);

    return (
        <StyledModal
            visible={visible}
            onPressOutside={hide}
            style={style.EditPlaylist}
            title={"Edit Playlist"}
        >
            <StyledButton
                text={"Show Details"}
                style={style.EditPlaylist_Button}
                buttonStyle={{ backgroundColor: colors.accent }}
                onPress={() => setShowFields(!showFields)}
            />

            { showFields && (
                <View style={style.EditPlaylist_Category}>
                    <StyledTextInput
                        value={newName}
                        default={playlist.name}
                        defaultColor={colors.gray}
                        textStyle={style.EditPlaylist_Text}
                        containerStyle={style.EditPlaylist_Input}
                        onChange={setNewName}
                        onFinish={async () => Playlist.editPlaylist({
                            id: playlist.id, name: newName
                        })}
                    />

                    <StyledTextInput
                        lines={4}
                        value={newDescription}
                        default={playlist.description}
                        defaultColor={colors.gray}
                        containerStyle={style.EditPlaylist_Input}
                        inputStyle={{ height: 100 }}
                        onChange={setNewDescription}
                        onFinish={async () => Playlist.editPlaylist({
                            id: playlist.id, description: newDescription
                        })}
                    />
                </View>
            ) }

            <StyledButton
                text={"Change Playlist Icon"}
                style={style.EditPlaylist_Button}
                buttonStyle={{ backgroundColor: colors.accent }}
                onPress={async () => {
                    const result = await pickIcon();
                    if (!result.canceled) {
                        // TODO: Upload the image to the server and set the new cover.
                    }
                }}
            />

            <StyledToggle
                title={"Private Playlist?"}
                value={isPrivate}
                onPress={async (val) => {
                    if (await Playlist.editPlaylist(
                        { id: playlist.id, isPrivate: val })) {
                        setPrivate(val);
                    }
                }}
            />

            <StyledButton
                text={"Delete Playlist"}
                style={style.EditPlaylist_Button}
                buttonStyle={{ backgroundColor: colors.red }}
                onHold={async () => {
                    if (await Playlist.deletePlaylist(playlist)) {
                        hide();
                        navigation.navigate("Summary");
                    } else {
                        log.error("Failed to delete playlist.");
                    }
                }}
            />
        </StyledModal>
    );
}

export default EditPlaylist;

const style = StyleSheet.create({
    EditPlaylist: {
        width: value.width * 0.8,
        flexDirection: "column",
        gap: 10
    },
    EditPlaylist_Button: {
        borderRadius: 10,
        width: "100%"
    },
    EditPlaylist_Category: {
        width: "100%",
        gap: 10
    },
    EditPlaylist_Text: {
        color: "white",
        textAlign: "center"
    },
    EditPlaylist_Input: {
        borderBottomWidth: 2,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "white",
        paddingLeft: 10,
        paddingRight: 10
    }
});
