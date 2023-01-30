import React from "react";
import { Text, StyleProp, TextStyle } from "react-native";

import { BasicTextStyle } from "@styles/TextStyle";

interface IProps {
    text: string;
    style?: StyleProp<TextStyle>;
}

class BasicText extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <Text style={{
                ...BasicTextStyle.container,
                ...(this.props.style as object)
            }}>
                {this.props.text}
            </Text>
        );
    }
}

export default BasicText;
