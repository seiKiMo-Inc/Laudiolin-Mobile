import { useState } from "react";
import { StyleSheet } from "react-native";

import StyledButton from "@components/StyledButton";
import StyledDropdown from "@components/StyledDropdown";

import { useColor, usePlaylists } from "@backend/stores";
import { OwnedPlaylist } from "@backend/types";

interface IProps {
    prompt?: string;
    action?: string;

    onSelect: (playlist: OwnedPlaylist) => void;
}

function SelectAPlaylist(props: IProps) {
    const colors = useColor();

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
                style={{
                    ...style.SelectAPlaylist_Button,
                    borderColor: colors.accent
                }}
                disabledStyle={{ backgroundColor: colors.gray }}
                buttonStyle={{ backgroundColor: colors.primary }}
                onPress={() => playlist && props.onSelect(playlist)}
            />
        </>
    );
}

export default SelectAPlaylist;

const style = StyleSheet.create({
    SelectAPlaylist_Button: {
        borderRadius: 10,
        borderWidth: 1
    }
});
