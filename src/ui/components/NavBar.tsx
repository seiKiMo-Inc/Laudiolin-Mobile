import React from "react";

import { Tab } from '@rneui/themed';

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
                 indicatorStyle={{ height: 0 }}
                 style={NavBarStyle.container}
             >
                 <Tab.Item title="Home" titleStyle={(active) => ({...NavBarStyle.tab, color: active ? "#FFFFFF" : "#6c7071"})} />
                 <Tab.Item title="Search" titleStyle={(active) => ({...NavBarStyle.tab, color: active ? "#FFFFFF" : "#6c7071"})} />
                 <Tab.Item title="Settings" titleStyle={(active) => ({...NavBarStyle.tab, color: active ? "#FFFFFF" : "#6c7071"})} />
             </Tab>
        );
    }
}

export default NavBar;
