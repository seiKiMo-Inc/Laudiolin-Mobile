import React from "react";
import { IconNode, Input } from "@rneui/base";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { BasicTextInputStyle } from "@styles/TextStyle";

interface IProps {
    default: string;
    icon?: IconNode;
    textStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;

    onChange?: (text: string) => void;
}

class BasicTextInput extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <Input
                rightIcon={this.props.icon}
                placeholder={this.props.default}
                inputStyle={{
                    ...BasicTextInputStyle.input,
                    ...(this.props.textStyle as object)
                }}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                containerStyle={{
                    ...(this.props.containerStyle as object)
                }}
                onChangeText={this.props.onChange}
            />
        );
    }
}

export default BasicTextInput;
