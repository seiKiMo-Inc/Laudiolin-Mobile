import React from "react";
import { ScrollView, View } from "react-native";

import { Icon } from "@rneui/base";
import Track from "@components/widgets/Track";
import BasicText from "@components/common/BasicText";
import List, { ListRenderItem } from "@components/common/List";
import JumpInView from "@components/common/JumpInView";

import { DownloadPageStyle, PlaylistsPageStyle } from "@styles/PageStyles";

import emitter from "@backend/events";
import { TrackData } from "@backend/types";
import { playTrack } from "@backend/audio";
import { navigate } from "@backend/navigation";
import { getDownloadedTracks, loadLocalTrackData } from "@backend/fs";

import { console } from "@app/utils";

interface IProps {
    showPage: boolean;
}

interface IState {
    downloads: TrackData[];
}

class DownloadsPage extends React.Component<IProps, IState> {
    /**
     * Loads the downloads.
     */
    loadDownloads = async () => {
        // Load the downloads.
        const downloads = await getDownloadedTracks();
        const tracks = []; for (const track of downloads)
            tracks.push(await loadLocalTrackData(track));
        this.setState({ downloads: tracks });
    };

    constructor(props: IProps) {
        super(props);

        this.state = {
            downloads: []
        }
    }

    renderTracks(info: ListRenderItem<TrackData>) {
        const { item, index } = info as ListRenderItem<TrackData>;
        if (item == null) return <></>;

        return (
            <Track
                key={index} track={item} padding={20}
                onClick={(track) => playTrack(track, true, true, true)}
            />
        );
    }

    componentDidMount() {
        emitter.on("download", this.loadDownloads);

        this.loadDownloads()
            .catch(err => console.error(err)); // Load the downloads.
    }

    componentWillUnmount() {
        emitter.removeListener("download", this.loadDownloads);
    }

    render() {
        return (
            this.props.showPage ?
                (<JumpInView visible={this.props.showPage} style={DownloadPageStyle.container}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={PlaylistsPageStyle.header}>
                            <Icon name={"chevron-left"} type={"material"} color={"white"} size={35} onPress={() => navigate("Home")} underlayColor={"#FFF"} />
                            <BasicText text={"Downloads"} style={{ fontSize: 25, fontWeight: "bold", marginLeft: 10 }} />
                        </View>

                        {
                            this.state.downloads.length > 0 ?
                                (<List
                                    data={this.state.downloads}
                                    renderItem={(info) => this.renderTracks(info)}
                                />) :
                                (<BasicText text={"No downloads yet."} style={{ textAlign: "center", justifyContent: "center", padding: 40 }}  />)
                        }
                    </ScrollView>
                </JumpInView>) : null
        );
    }
}

export default DownloadsPage;
