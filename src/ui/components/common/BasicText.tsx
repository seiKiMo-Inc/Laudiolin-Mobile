import React from "react";
import { View, Text, StyleProp, TextStyle } from "react-native";

import { BasicTextStyle } from "@styles/TextStyle";

interface IProps {
    text: string;
    numberOfLines?: number;
    width?: number;
    style?: StyleProp<TextStyle>;
}

class BasicText extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <View style={{ width: this.props.width }}>
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
