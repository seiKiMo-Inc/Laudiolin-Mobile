import React from "react";
import { TouchableHighlight, View, Animated } from "react-native";

import FastImage from "react-native-fast-image";
import BasicText from "@components/common/BasicText";

import { UserStyle } from "@styles/WidgetStyle";

import type { OfflineUser, OnlineUser } from "@backend/types";
import {Text} from "@rneui/themed";
import BasicButton from "@components/common/BasicButton";

interface IProps {
    user: OnlineUser&OfflineUser;
    isOffline?: boolean;
}

interface IState {
    isExpanded: boolean;
}

class User extends React.PureComponent<IProps, IState> {
    _height: Animated.Value = new Animated.Value(70);

    constructor(props: IProps) {
        super(props);

        this.state = {
            isExpanded: false,
        }
    }

    toTime(duration: number|undefined = 0) {
        let seconds: string|number = Math.floor((duration) % 60);
        let minutes: string|number = Math.floor((duration / (60)) % 60);

        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        return [minutes, seconds];
    }

    animateChangeInHeight = () => {
        Animated.timing(this._height, {
            toValue: this.state.isExpanded ? 70 : 220,
            duration: 100,
            useNativeDriver: false
        }).start();

        this.setState({ isExpanded: !this.state.isExpanded })
    }

    render() {
        const { user } = this.props;

        return (
            <TouchableHighlight
                underlayColor={`rgba(0, 0, 0, 0.9)`}
                onPress={this.animateChangeInHeight}
                disabled={this.props.isOffline}
            >
                <Animated.View style={{ ...UserStyle.container, height: this._height  }}>
                    {
                        this.props.isOffline ?
                            <View style={UserStyle.offlineOverlay} /> :
                            null
                    }
                    <View style={{ flexDirection: "row" }}>
                        <FastImage
                            style={UserStyle.userIcon}
                            source={{ uri: user.avatar }}
                            resizeMode={"cover"}
                        />

                        <View style={UserStyle.text}>
                            <BasicText text={`${user.username}#${user.discriminator}`} style={UserStyle.title} />
                            { !this.state.isExpanded ? this.props.isOffline ?
                                <BasicText text={"Last listening to: " + user.lastListeningTo?.title} numberOfLines={1} containerStyle={UserStyle.subtitle} /> :
                                <BasicText text={"Listening to: " + user.listeningTo?.title} numberOfLines={1} containerStyle={UserStyle.subtitle} /> :
                                null
                            }
                        </View>
                    </View>

                    {
                        this.props.isOffline || !this.state.isExpanded ?
                            null :
                            (
                                <View style={UserStyle.detailsContainer}>
                                    <View style={UserStyle.details}>
                                        <FastImage
                                            style={UserStyle.detailsIcon}
                                            source={{ uri: user.listeningTo?.icon }}
                                            resizeMode={"cover"}
                                        />

                                        <View style={UserStyle.detailsText}>
                                            <Text numberOfLines={3} style={{ color: "white" }}>
                                                <Text style={{ fontWeight: "bold", color: "white", fontSize: 16 }}>Listening to: </Text>
                                                {user.listeningTo?.title}
                                            </Text>
                                            <Text numberOfLines={3} style={{ color: "white" }}>
                                                <Text style={{ fontWeight: "bold", color: "white", fontSize: 16 }}>Elapsed: </Text>
                                                {this.toTime(user.progress).join(":")}
                                            </Text>
                                        </View>
                                    </View>

                                    <BasicButton
                                        text={"Listen Along!"}
                                        button={UserStyle.button}
                                        container={{ marginTop: 15 }}
                                        title={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                                    />
                                </View>
                            )
                    }
                </Animated.View>
            </TouchableHighlight>
        );
    }
}

export default User;
