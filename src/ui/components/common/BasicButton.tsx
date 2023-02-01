import React from "react";
import { FlexStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

import { Button } from "@rneui/themed";
import { IconNode } from "@rneui/base";

interface IProps {
    text?: string;
    icon?: IconNode;
    bold?: boolean;
    color?: string;
    outline?: string;
    textColor?: string;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: string | number;
    height?: string | number;
    radius?: number;
    transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';

    press?: () => void;

    container?: StyleProp<FlexStyle>;
    button?: StyleProp<TextStyle>;
    title?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<ViewStyle>;
}

class BasicButton extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <Button
                type={this.props.outline ? "outline" : "solid"}
                icon={this.props.icon}
                title={this.props.text}
                color={this.props.color}
                containerStyle={{
                    paddingLeft: this.props.left ?? 0,
                    paddingRight: this.props.right ?? 0,
                    paddingTop: this.props.top ?? 0,
                    paddingBottom: this.props.bottom ?? 0,
                    ...(this.props.container as object),
                }}
                buttonStyle={{
                    width: this.props.width ?? 300,
                    height: this.props.height ?? 50,
                    borderColor: this.props.outline,
                    borderWidth: 1,
                    borderRadius: this.props.radius ?? 5,
                    ...(this.props.button as object),
                }}
                titleStyle={{
                    color: this.props.textColor ?? "#FFFFFF",
                    fontWeight: this.props.bold ? "bold" : "normal",
                    textTransform: this.props.transform,
                    fontFamily: "Poppins",
                    ...(this.props.title as object),
                }}
                iconContainerStyle={this.props.iconStyle}
                onPress={this.props.press}
            />
        );
    }
}

export default BasicButton;
