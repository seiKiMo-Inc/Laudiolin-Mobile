import React from "react";
import { Text, StyleProp, TextStyle } from "react-native";

import { BasicTextStyle } from "@styles/TextStyle";

interface IProps {
    first: string;
    second: string;
    firstStyle?: StyleProp<TextStyle>;
    secondStyle?: StyleProp<TextStyle>;
    style?: StyleProp<TextStyle>;
}

class MixedText extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <Text style={{
                ...BasicTextStyle.container,
                ...(this.props.style as object)
            }}>
                <Text style={{
                    ...BasicTextStyle.container,
                    ...(this.props.firstStyle as object)
                }}>{this.props.first}</Text><Text style={{
                    ...BasicTextStyle.container,
                    ...(this.props.secondStyle as object)
                }}>{this.props.second}</Text>
            </Text>
        );
    }
}

export default MixedText;
