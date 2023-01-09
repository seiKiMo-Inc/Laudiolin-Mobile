import React from "react";

import { Tab } from '@rneui/themed';

import { NavBarStyle } from "@styles/NavBarStyle"
interface IProps {
    pageIndex: number
    setPageIndex: (i: number) => void
}

class NavBar extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
             <Tab
                 value={this.props.pageIndex}
                 onChange={this.props.setPageIndex}
                 indicatorStyle={{ backgroundColor: '#FFFFFF', height: 3 }}
                 style={NavBarStyle.container}
             >
                 <Tab.Item title="Home" titleStyle={{ fontSize: 12, color: "#FFFFFF" }} />
                 <Tab.Item title="Search" titleStyle={{ fontSize: 12, color: "#FFFFFF"}} />
                 <Tab.Item title="Settings" titleStyle={{ fontSize: 12, color: "#FFFFFF" }} />
             </Tab>
        );
    }
}

export default NavBar;
