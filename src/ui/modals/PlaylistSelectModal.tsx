import React from "react";

import BasicDropdown from "@components/common/BasicDropdown";
import BasicModal from "@components/common/BasicModal";

import type { PlaylistSelectInfo } from "@backend/types";
import emitter from "@backend/events";
import { playlists } from "@backend/user";

import { PlaylistSelectStyle } from "@styles/ModalStyle";

interface IState {
    show: boolean;
    selected: string;

    playlists: string[];

    modalTitle: string;
    submitAction?: (playlist: string) => void;
}

class PlaylistSelectModal extends React.Component<any, IState> {
    /**
     * Updates the available playlists.
     */
    update = () => {
        this.setState({
            playlists: playlists.map((p) => p.name)
        });
    };

    /**
     * Select a playlist.
     */
    select = (data: PlaylistSelectInfo) => {
        this.show(data); console.info("Selecting playlist");
    };

    constructor(props: any) {
        super(props);

        this.state = {
            show: false,
            selected: "",

            playlists: [],

            modalTitle: ""
        };
    }

    /**
     * Shows the modal.
     */
    show(data: PlaylistSelectInfo): void {
        this.setState({
            show: true,
            modalTitle: data.title,
            submitAction: (title: string) => {
                data.callback(playlists.find(p => p.name === title));
                this.setState({ show: false });
            },

            playlists: playlists.map((p) => p.name),
        });
    }

    componentDidMount() {
        emitter.on("playlist", this.update);
        emitter.on("selectPlaylist", this.select);
    }

    componentWillUnmount() {
        emitter.removeListener("playlist", this.update);
        emitter.removeListener("selectPlaylist", this.select);
    }

    render() {
        return (
            <BasicModal
                title={this.state.modalTitle}

                showModal={this.state.show}
                onBackdropPress={() => this.setState({ show: false })}

                onSubmit={() => this.state.submitAction?.(this.state.selected)}
            >
                <BasicDropdown
                    initial={"Select a Playlist"}
                    options={this.state.playlists}
                    select={value => this.setState({ selected: value })}

                    buttonStyle={PlaylistSelectStyle.button}
                    rowTextStyle={PlaylistSelectStyle.text}
                    textStyle={PlaylistSelectStyle.text}
                    menuStyle={PlaylistSelectStyle.menu}
                />
            </BasicModal>
        );
    }
}

export default PlaylistSelectModal;
