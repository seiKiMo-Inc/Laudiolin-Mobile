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
                <View>
                    <View style={{
                        height: 62,
                        width: Dimensions.get("window").width - 40 - 100,

                        position: "absolute",
                        borderColor: "white",
                        borderRadius: 20,
                        borderWidth: 1
                    }} />

                    <Image
                        source={require("../../../../resources/images/icon.png")}
                        style={ControlStyle.image}
                    />
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
                            text={"Laudiolin"}
                            style={{ fontSize: 20, paddingTop: 30 }}
                        />
                        <BasicText
                            text={"Magix"}
                            style={{ fontSize: 14, paddingBottom: 20 }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export default QuickControl;
