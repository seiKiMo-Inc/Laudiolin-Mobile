import React from "react";
import { Animated, StyleProp, ViewStyle, Dimensions } from "react-native";

interface IProps {
    visible: boolean;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    duration?: number;
}

class JumpInView extends React.Component<IProps, never> {
    _translateY: Animated.Value;
    _windowHeight: number = Dimensions.get("window").height;
    constructor(props: IProps) {
        super(props);

        this._translateY = new Animated.Value(this._windowHeight);
    }

    animateIn = () => {
        Animated.timing(this._translateY, {
            toValue: 0,
            duration: this.props.duration || 300,
            useNativeDriver: true
        }).start();
    }

    componentDidMount() {
        this.animateIn();
    }

    render() {
        return (
            <Animated.View
                style={{
                    ...this.props.style as object,
                    transform: [{ translateY: this._translateY }]
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}

export default JumpInView;
