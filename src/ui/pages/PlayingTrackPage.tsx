import React from "react";
import { Text, View, ImageBackground } from "react-native";

import { Icon, Image } from "@rneui/themed";
import BasicText from "@components/common/BasicText";
import ProgressBar from "@components/player/ProgressBar";
import Controls from "@components/player/Controls";

import { PlayingTrackPageStyle } from "@styles/PageStyles";

import { TrackData } from "@backend/types";
import { shuffleQueue } from "@backend/audio";
import TrackPlayer from "react-native-track-player";

const track: TrackData = {
    title: "Travelogue (Global Acappella Ver.)",
    artist: "HoYoVerse",
    icon: "https://i.scdn.co/image/ab67616d0000b273e933b812f801dc6e55fda564",
    url: "http://10.0.2.2:3000/download?id=n-HypaOLx_s&engine=YouTube",
    id: "n-HypaOLx_s",
    duration: 1860000
};


interface IProps {
    showPage: boolean;
    showPageFn: (show: boolean) => void;
}

class PlayingTrackPage extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return this.props.showPage ? (
                <View style={PlayingTrackPageStyle.view}>
                    <ImageBackground
                        style={PlayingTrackPageStyle.background}
                        source={{ uri: track.icon }}
                        blurRadius={50}
                    >
                        <View style={{ ...PlayingTrackPageStyle.background, backgroundColor: "rgba(0,0,0, 0.6)" }} />
                    </ImageBackground>

                    <View style={PlayingTrackPageStyle.topBar}>
                        <Icon
                            name={"chevron-left"}
                            type={"material"}
                            size={30}
                            color={"#FFFFFF"}
                            onPress={() => this.props.showPageFn(false)}
                        />
                        
                        <View style={PlayingTrackPageStyle.topBarText}>
                            <BasicText 
                                text={"Playing From Playlist"}
                                style={{ textTransform: "uppercase" }}
                            />
                            <BasicText 
                                text={"Favorites"}
                                style={{ fontWeight: "bold", color: "#FFFFFF" }} 
                            />
                        </View>
                        
                        <Icon
                            name={"more-vert"}
                            type={"material"}
                            size={30}
                            color={"#FFFFFF"}
                            onPress={() => console.log("TODO: Show more options") /* TODO: Make more-vert menu */}
                        />
                    </View>

                    <View style={PlayingTrackPageStyle.trackInfo}>
                        <Image
                            style={PlayingTrackPageStyle.trackImage}
                            source={{ uri: track.icon }}
                        />
                        
                        <View style={{ padding: 25, flexDirection: "column", gap: 10 }}>
                            <BasicText 
                                numberOfLines={2} 
                                style={{ color: "#FFFFFF", fontSize: 25 }} 
                                text={track.title}
                            />
                            <BasicText 
                                numberOfLines={1} 
                                style={{ color: "#a1a1a1", fontSize: 15 }} 
                                text={track.artist}
                            />

                            <ProgressBar 
                                trackLength={track.duration} 
                                currentTime={track.duration / 2} 
                                onSeek={() => null} 
                                onSlidingStart={() => null} 
                            />

                            <Controls
                                shuffleRepeatControl={async () => await shuffleQueue()}
                                skipToPreviousControl={async () => await TrackPlayer.skipToPrevious()}
                                playControl={async () => await TrackPlayer.play()}
                                skipToNextControl={async () => await TrackPlayer.skipToNext()}
                                makeFavoriteControl={async () => null} />
                        </View>
                    </View>
                </View>
            )
        : null;
    }
}

export default PlayingTrackPage;
