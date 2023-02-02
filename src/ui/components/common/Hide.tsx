import React from "react";

interface IProps {
    show: boolean;
    children: any;
}
class Hide extends React.Component<IProps, never> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return this.props.show ? this.props.children : null;
    }
}

export default Hide;
