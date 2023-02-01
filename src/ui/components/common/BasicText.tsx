import React from "react";
import { Text, StyleProp, TextStyle, TouchableHighlight } from "react-native";

import { BasicTextStyle } from "@styles/TextStyle";

interface IProps {
    text: string;
    style?: StyleProp<TextStyle>;
    press?: () => void;
}

class BasicText extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return this.props.press ? (
            <TouchableHighlight
                onPress={this.props.press}
            >
                <Text style={{
                    ...BasicTextStyle.text,
                    ...(this.props.style as object)
                }}>
                    {this.props.text}
                </Text>
            </TouchableHighlight>
        ) : (
            <Text style={{
                ...BasicTextStyle.text,
                ...(this.props.style as object)
            }}>
                {this.props.text}
            </Text>
        );
    }
}

export default BasicText;
