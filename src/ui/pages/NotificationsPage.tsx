import React from "react";
import { Dimensions, View, FlatList, ListRenderItemInfo } from "react-native";

import { TabView, Tab } from "@rneui/themed";
import InAppNotification from "@components/InAppNotification";
import BasicText from "@components/common/BasicText";

import { InAppNotificationData } from "@backend/types";

import { NotificationsPageStyle } from "@styles/PageStyles";

const placeholderNotifications: InAppNotificationData[] = [
    {
        message: "Finished downloading \"The Best of 2019\" playlist",
        icon: "file-download",
        date: new Date(),
        onPress: () => console.log("Pressed")
    },
    {
        message: "Finished downloading \"The Best of 2022\" playlist",
        icon: "file-download",
        date: new Date(),
        onPress: () => console.log("Pressed")
    }
];

interface IState {
    notifications: InAppNotificationData[];
    tabIndex: number;
}

class NotificationsPage extends React.Component<any, IState> {
    constructor(props: never) {
        super(props);

        this.state = {
            notifications: placeholderNotifications,
            tabIndex: 0
        }
    }

    renderNotification(item: ListRenderItemInfo<InAppNotificationData>) {
        return <InAppNotification key={item.index} notification={item.item} />;
    }

    render() {
        return (
            <View style={NotificationsPageStyle.container}>
                <Tab
                    value={this.state.tabIndex}
                    style={NotificationsPageStyle.tab}
                    indicatorStyle={{ backgroundColor: "#0a3cef" }}
                    onChange={(i) => this.setState({ tabIndex: i })}
                >
                    <Tab.Item title={"Notifications"} titleStyle={{ color: "#5492ff" }} />
                    <Tab.Item title={"Friend Activity"} titleStyle={{ color: "#5492ff" }} />
                </Tab>

                <TabView
                    value={this.state.tabIndex}
                    animationType="spring"
                    onChange={(i) => this.setState({ tabIndex: i })}
                    minSwipeRatio={0.1}
                >
                    <TabView.Item>
                        <FlatList
                            data={this.state.notifications}
                            renderItem={this.renderNotification}
                            ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: "#0089d3", width: "80%", alignSelf: "center" }} />}
                        />
                    </TabView.Item>
                    <TabView.Item>
                        <View style={{ height: "100%", width: Dimensions.get("window").width, justifyContent: "center", alignItems: "center" }}>
                            <BasicText text="Friend Activity" />
                            <BasicText text="Doesnt exist yet lol" />
                        </View>
                    </TabView.Item>
                </TabView>
            </View>
        );
    }
}

export default NotificationsPage;
