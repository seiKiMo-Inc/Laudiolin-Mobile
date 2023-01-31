import React from "react";
import { View } from "react-native";

import { PlayingTrackPageStyle } from "@styles/PageStyles";
import BasicButton from "@components/common/BasicButton";

interface IProps {
    showPage: boolean;
}

class PlayingTrackPage extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return this.props.showPage
        ? (
                <View style={PlayingTrackPageStyle.view}>
                    <BasicButton text={"Log in with Discord"}
                                 color={"#5b67af"} bold={true}
                                 width={300} height={40} radius={10}
                                 transform={"uppercase"}
                    />
                </View>
            )
        : null;
    }
}

export default PlayingTrackPage;
