import React from "react";
import { View, Text, StyleProp, TextStyle, TouchableHighlight, ViewStyle } from "react-native";

import { BasicTextStyle } from "@styles/TextStyle";

interface IProps {
    text: string;
    numberOfLines?: number;
    style?: StyleProp<TextStyle>;

    press?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
}

class BasicText extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return this.props.press ? (
            <View style={this.props.containerStyle}>
                <TouchableHighlight
                    underlayColor={"transparent"}
                    onPress={this.props.press}
                >
                    <Text
                        style={{
                        ...BasicTextStyle.text,
                        ...(this.props.style as object)
                    }}
                        numberOfLines={this.props.numberOfLines}
                    >
                        {this.props.text}
                    </Text>
                </TouchableHighlight>
            </View>
                ) : (
                <View style={this.props.containerStyle}>
                    <Text
                        style={{
                            ...BasicTextStyle.text,
                            ...(this.props.style as object)
                        }}
                        numberOfLines={this.props.numberOfLines}
                    >
                        {this.props.text}
                    </Text>
                </View>
        );
    }
}

export default BasicText;
