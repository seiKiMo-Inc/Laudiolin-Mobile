import React from "react";
import { StyleProp, TextStyle } from "react-native";

import { CheckBox } from "@rneui/themed";

interface IProps {
    checked: boolean;
    onPress: () => void;
    container?: object;
    checkedIcon?: React.ReactElement;
    uncheckedIcon?: React.ReactElement;
    label?: string;
    labelStyle?: StyleProp<TextStyle>;
    iconRight?: boolean;
}

class BasicCheckbox extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <CheckBox
                checked={this.props.checked ?? false}
                onPress={this.props.onPress}
                containerStyle={{
                    ...this.props.container,
                    backgroundColor: "transparent",
                }}
                iconType="material"
                checkedIcon={this.props.checkedIcon ?? "radio-button-checked"}
                uncheckedIcon={this.props.uncheckedIcon ?? "radio-button-unchecked"}
                iconRight={this.props.iconRight ?? false}
                checkedColor={"#0053b4"}
                uncheckedColor={"#c9c9c9"}
                size={20}
                title={this.props.label}
                titleProps={{
                    style: {
                        ...this.props.labelStyle as object,
                        paddingLeft: 10,
                        color: "#ffffff",
                        fontSize: 16,
                    }
                }}
            />
        );
    }
}

export default BasicCheckbox;
