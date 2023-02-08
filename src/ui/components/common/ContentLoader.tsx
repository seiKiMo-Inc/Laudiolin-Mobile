import React from "react";

import { View, ActivityIndicator } from "react-native";

interface IProps {
    style?: any;
    color?: string;
    size?: "small" | "large" | number;
}

class ContentLoader extends React.Component<IProps, never> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View style={this.props.style}>
                <ActivityIndicator size={this.props.size ?? "large"} color={this.props.color ?? "#5bc6ff"} />
            </View>
        );
    }
}

export default ContentLoader;
