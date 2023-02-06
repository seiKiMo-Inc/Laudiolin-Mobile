import React from "react";

import { Tab } from "@rneui/themed";

import { NavBarStyle } from "@styles/NavBarStyle"

interface IProps {
    pageIndex: number;
    setPageIndex: (i: number) => void;
}

class NavBar extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
             <Tab
                 value={this.props.pageIndex}
                 onChange={this.props.setPageIndex}
                 disableIndicator={true}
                 style={NavBarStyle.container}
             >
                 <Tab.Item icon={{ name: "home", type: "material", color: this.props.pageIndex == 0 ? "#5bc6ff" : "#bebebe", size: 30 }} />
                 <Tab.Item icon={{ name: "search", type: "material", color: this.props.pageIndex == 1 ? "#5bc6ff" : "#bebebe", size: 30 }} />
                 <Tab.Item icon={{ name: "notifications", type: "material", color: this.props.pageIndex == 2 ? "#5bc6ff" : "#bebebe", size: 30 }} />
                 <Tab.Item icon={{ name: "account-circle", type: "material", color: this.props.pageIndex == 3 ? "#5bc6ff" : "#bebebe", size: 30 }} />
             </Tab>
        );
    }
}

export default NavBar;
