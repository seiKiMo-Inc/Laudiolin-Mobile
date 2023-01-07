import React from "react";

import Icon from "react-native-vector-icons/FontAwesome";

interface IProps {

}

interface IState {}


class Controls extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <>
                <Icon.Button name={"facebook"} />
            </>
        );
    }
}

export default Controls;
