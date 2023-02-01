import React from "react";
import { Dimensions, View } from "react-native";

import { Icon, Image } from "@rneui/base";
import BasicText from "@components/common/BasicText";

import { ControlStyle } from "@styles/TrackStyle";

interface IState {
    paused: boolean;
}

class QuickControl extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            paused: false
        };
    }

    render() {
        const toggle = this.state.paused ? "play-arrow" : "pause";

        return (
            <View style={ControlStyle.container}>
                <View style={{ justifyContent: "center" }}>
                    <View style={{
                        height: 65,
                        width: Dimensions.get("window").width - 33 - 100,
                        position: "absolute",
                        borderColor: "#1e85ad",
                        borderRadius: 20,
                        borderWidth: 5
                    }} />

                    <Image
                        source={require("../../../../resources/images/icon.png")}
                        style={ControlStyle.image}
                    >
                        <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", height: "100%", width: "100%", borderRadius: 20 }} />
                    </Image>
                </View>

                <View style={{ justifyContent: "center" }}>
                    <View style={ControlStyle.controls}>
                        <Icon
                            color={"white"}
                            type={"material"} name={toggle}
                            iconStyle={ControlStyle.button}
                        />

                        <Icon
                            color={"white"}
                            type={"material"} name={"skip-next"}
                            iconStyle={ControlStyle.button}
                        />
                    </View>

                    <View style={ControlStyle.info}>
                        <BasicText
                            text={"Laudiolin aaaaaaaaaaaaaaaaaaaaaaaaaaa"}
                            numberOfLines={1}
                            style={{ fontSize: 17 }}
                            width={Dimensions.get("window").width - 220}
                        />
                        <BasicText
                            text={"Magix"}
                            style={{ fontSize: 14 }}
                            numberOfLines={1}
                            width={Dimensions.get("window").width - 220}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export default QuickControl;
