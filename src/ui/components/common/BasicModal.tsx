import React from "react";

import { Overlay } from "@rneui/themed";

import BasicText from "@components/common/BasicText";
import BasicButton from "@components/common/BasicButton";

interface IProps {
    showModal: boolean;
    children: React.ReactNode;
    onSubmit: () => void;
    title?: string;
    onBackdropPress?: () => void;
}

class BasicModal extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <Overlay
                isVisible={this.props.showModal}
                backdropStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                overlayStyle={{
                    borderRadius: 10,
                    backgroundColor: "#070a1e",
                    padding: 20,
                    flexDirection: "column",
                }}
                onBackdropPress={this.props.onBackdropPress}
            >
                {this.props.title != null ? (
                    <BasicText
                        text={this.props.title}
                        style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
                    />
                ) : null}
                {this.props.children}
                <BasicButton
                    text={"Submit"}
                    press={this.props.onSubmit}
                    container={{ marginTop: 20, padding: 10 }}
                    button={{ width: "100%", height: 50 }}
                />
            </Overlay>
        );
    }
}

export default BasicModal;
