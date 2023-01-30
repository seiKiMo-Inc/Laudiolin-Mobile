import React from "react";
import { Button } from '@rneui/themed';

interface IProps {
    text: string;
    bold?: boolean;
    color?: string;
    outline?: string;
    textColor?: string;
    width?: string | number;
    height?: string | number;
    radius?: number;
    transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}

class BasicButton extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <Button
                type={this.props.outline ? "outline" : "solid"}
                title={this.props.text}
                color={this.props.color}
                buttonStyle={{
                    width: this.props.width ?? 300,
                    height: this.props.height ?? 50,
                    borderColor: this.props.outline,
                    borderWidth: 1,
                    borderRadius: this.props.radius ?? 5,
                }}
                titleStyle={{
                    color: this.props.textColor ?? "#FFFFFF",
                    fontWeight: this.props.bold ? "bold" : "normal",
                    textTransform: this.props.transform,
                    fontFamily: "Poppins"
                }}
            />
        );
    }
}

export default BasicButton;
