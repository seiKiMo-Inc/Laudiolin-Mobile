import React from "react";
import { Dimensions, View, FlatList, ListRenderItemInfo } from "react-native";

import { TabView, Tab } from "@rneui/themed";
import InAppNotification from "@components/InAppNotification";
import BasicText from "@components/common/BasicText";
import User from "@components/widgets/User";

import { InAppNotificationData, OfflineUser, OnlineUser } from "@backend/types";
import { getAvailableUsers, getRecentUsers } from "@backend/social";

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
    users: (OnlineUser|OfflineUser)[];
}

class NotificationsPage extends React.Component<any, IState> {
    constructor(props: never) {
        super(props);

        this.state = {
            notifications: placeholderNotifications,
            tabIndex: 0,
            users: []
        }
    }

    renderNotification(item: ListRenderItemInfo<InAppNotificationData>) {
        return <InAppNotification key={item.index} notification={item.item} />;
    }

    renderUser(item: ListRenderItemInfo<any>) {
        if (item.item.listeningTo) {
            return <User key={item.index} user={item.item} />;
        } else {
            return <User key={item.index} user={item.item} isOffline={true} />;
        }
    }

    componentDidMount() {
        getAvailableUsers().then((users) => {
            this.setState({ users: users });
            getRecentUsers().then((recentUsers) => {
                this.setState({ users: [...this.state.users, ...recentUsers] });
            });
        });
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
                        <View style={{ padding: 10 }}>
                            <FlatList
                                data={this.state.users}
                                renderItem={(item) => this.renderUser(item)}
                                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            />
                        </View>
                    </TabView.Item>
                </TabView>
            </View>
        );
    }
}

export default NotificationsPage;
