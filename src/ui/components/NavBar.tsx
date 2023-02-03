import React from "react";

import {Icon, Tab} from '@rneui/themed';

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
                 <Tab.Item
                     title="Home"
                     titleStyle={(active) => ({ ...NavBarStyle.tab, color: active ? "#5bc6ff" : "#bebebe" })}
                     icon={{ name: "home", type: "material", color: this.props.pageIndex == 0 ? "#5bc6ff" : "#bebebe" }}
                 />
                 <Tab.Item
                     title="Search"
                     titleStyle={(active) => ({...NavBarStyle.tab, color: active ? "#5bc6ff" : "#bebebe"})}
                     icon={{ name: "search", type: "material", color: this.props.pageIndex == 1 ? "#5bc6ff" : "#bebebe" }}
                 />
                 <Tab.Item
                     title="Settings"
                     titleStyle={(active) => ({...NavBarStyle.tab, color: active ? "#5bc6ff" : "#bebebe"})}
                     icon={{ name: "settings", type: "material", color: this.props.pageIndex == 2 ? "#5bc6ff" : "#bebebe" }}
                 />
             </Tab>
        );
    }
}

export default NavBar;
