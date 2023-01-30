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
                 <Tab.Item title="Home" titleStyle={NavBarStyle.tab} />
                 <Tab.Item title="Search" titleStyle={NavBarStyle.tab} />
                 <Tab.Item title="Settings" titleStyle={NavBarStyle.tab} />
             </Tab>
        );
    }
}

export default NavBar;
