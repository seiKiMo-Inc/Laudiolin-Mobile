import React from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

import { NavigationSwitchScreenProps } from "react-navigation";

interface IProps {
    duration?: number;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    navigation: NavigationSwitchScreenProps["navigation"];
}

class FadeInView extends React.Component<IProps, never> {
    _fadeAnim = new Animated.Value(0);
    constructor(props: IProps) {
        super(props);
    }

    componentDidMount() {
        this.props.navigation.addListener("focus", () => {
            Animated.timing(
                this._fadeAnim,
                {
                    toValue: 1,
                    duration: this.props.duration || 300,
                    useNativeDriver: true
                }
            ).start();
        });

        this.props.navigation.addListener("blur", () => this._fadeAnim.setValue(0));
    }

    render() {
        return (
            <Animated.View
                style={{
                    ...this.props.style as object,
                    opacity: this._fadeAnim
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}

export default FadeInView;
