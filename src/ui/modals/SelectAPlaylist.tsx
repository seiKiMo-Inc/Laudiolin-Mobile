import { useState } from "react";
import { StyleSheet } from "react-native";

import StyledButton from "@components/StyledButton";
import StyledDropdown from "@components/StyledDropdown";

import { usePlaylists } from "@backend/stores";
import { OwnedPlaylist } from "@backend/types";

import { colors } from "@style/Laudiolin";

interface IProps {
    prompt?: string;
    action?: string;

    onSelect: (playlist: OwnedPlaylist) => void;
}

function SelectAPlaylist(props: IProps) {
    let playlists = usePlaylists();
    playlists = Object.values(playlists);

    const [playlist, setPlaylist] = useState<OwnedPlaylist | undefined>(undefined);

    return (
        <>
            <StyledDropdown
                default={props.prompt ?? "Select a Playlist"}
                options={playlists.map(p => p.name)}
                onSelect={(selected) => {
                    setPlaylist(playlists.find(p => p.name == selected));
                }}
            />

            <StyledButton
                disabled={!playlist}
                text={props.action ?? "Select"}
                style={style.SelectAPlaylist_Button}
                disabledStyle={style.SelectAPlaylist_Button_Disabled}
                buttonStyle={style.SelectAPlaylist_Container}
            />
        </>
    );
}

export default SelectAPlaylist;

const style = StyleSheet.create({
    SelectAPlaylist_Button: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.accent
    },
    SelectAPlaylist_Button_Disabled: {
        backgroundColor: colors.gray
    },
    SelectAPlaylist_Container: {
        backgroundColor: colors.primary
    }
});
