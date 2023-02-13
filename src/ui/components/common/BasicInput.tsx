import React from "react";
import { StyleProp,  ViewStyle, TextStyle } from "react-native";

import { Input } from "@rneui/themed";

interface IProps {
    text?: string;
    multiline?: boolean;
    numberOfLines?: number;
    ref?: React.RefObject<any>;
    placeholder?: string;
    onChangeText: (text: string) => void;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    label?: string;
}

class BasicInput extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <Input
                value={this.props.text}
                label={this.props.label ?? ""}
                ref={this.props.ref ?? null}
                placeholder={this.props.placeholder ?? ""}
                onChangeText={this.props.onChangeText}
                inputContainerStyle={{
                    ...this.props.containerStyle as object,
                    width: "100%",
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: "#12207e",
                    paddingRight: 10,
                    paddingLeft: 10,
                }}
                labelStyle={{ paddingBottom: 10 }}
                inputStyle={{ ...this.props.inputStyle as object, color: "#ffffff" }}
                multiline={this.props.multiline ?? false}
                numberOfLines={this.props.numberOfLines ?? 1}
            />
        );
    }
}

export default BasicInput;
