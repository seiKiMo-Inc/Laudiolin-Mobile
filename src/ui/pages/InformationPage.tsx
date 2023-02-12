import React from "react";
import { View, FlatList, ListRenderItemInfo } from "react-native";

import { TabView, Tab } from "@rneui/themed";
import InAppNotification from "@components/InAppNotification";
import User from "@components/widgets/User";

import { NotificationsPageStyle } from "@styles/PageStyles";

import type { InAppNotificationData, OfflineUser, OnlineUser } from "@backend/types";
import { registerListener, unregisterListener, dismissAll, notifications } from "@backend/notifications";
import { getAvailableUsers, getRecentUsers } from "@backend/social";
import { userData } from "@backend/user";
import emitter from "@backend/events";

interface IState {
    notifications: InAppNotificationData[];
    tabIndex: number;
    users: (OnlineUser|OfflineUser)[];
}

class InformationPage extends React.Component<any, IState> {
    /**
     * Updates the notifications.
     */
    notificationUpdate = (notifications: InAppNotificationData[]) =>
        this.setState({ notifications });

    /**
     * Updates the users.
     */
    userUpdate = async () => {
        // Fetch the users from the backend.
        await this.fetchUsers();
    };

    reloadInterval: any = null;

    constructor(props: never) {
        super(props);

        this.state = {
            notifications,
            tabIndex: 0,
            users: []
        };
    }

    renderNotification(item: ListRenderItemInfo<InAppNotificationData>) {
        return <InAppNotification
            key={item.index} index={item.index}
            notification={item.item}
        />;
    }

    renderUser(item: ListRenderItemInfo<any>) {
        if (item.item.listeningTo) {
            return <User key={item.index} user={item.item} />;
        } else {
            return <User key={item.index} user={item.item} isOffline={true} />;
        }
    }

    /**
     * Fetches recent and online users.
     */
    async fetchUsers(): Promise<void> {
        // Fetch the users from the backend.
        const availableUsers = await getAvailableUsers(true);
        const recentUsers = await getRecentUsers();
        // Filter users that are the current user.
        const users = availableUsers.concat(recentUsers)
            .filter(user => user.userId != userData?.userId);
        // Set the users.
        this.setState({ users });
    }

    async componentDidMount() {
        registerListener(this.notificationUpdate);
        await this.fetchUsers();

        // Set a reload interval.
        this.reloadInterval = setInterval(this.userUpdate, 10e3);

        // Set a listener for app state.
        emitter.on("appState", state => {
            if (state == "background") {
                this.reloadInterval && clearInterval(this.reloadInterval);
            } else if (state == "active") {
                this.reloadInterval = setInterval(this.userUpdate, 10e3);
            }
        });
    }

    componentWillUnmount() {
        unregisterListener(this.notificationUpdate);
        this.reloadInterval && clearInterval(this.reloadInterval);
    }

    render() {
        return (
            <View style={NotificationsPageStyle.container}>
                <Tab
                    value={this.state.tabIndex}
                    style={NotificationsPageStyle.tab}
                    indicatorStyle={{ backgroundColor: "#0a3cef" }}
                    onChange={page => this.setState({ tabIndex: page })}
                >
                    <Tab.Item title={"Notifications"} titleStyle={{ color: "#5492ff" }}
                              onLongPress={() => dismissAll()} />
                    { userData && <Tab.Item title={"Friend Activity"} titleStyle={{ color: "#5492ff" }} /> }
                </Tab>

                <TabView
                    value={this.state.tabIndex}
                    animationType="spring"
                    onChange={(i) => this.setState({ tabIndex: i })}
                    minSwipeRatio={0.1}
                >
                    <TabView.Item>
                        {
                            this.state.tabIndex == 0 && (
                                <FlatList
                                    data={this.state.notifications}
                                    renderItem={this.renderNotification}
                                    ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: "#0089d3", width: "80%", alignSelf: "center" }} />}
                                />
                            )
                        }
                    </TabView.Item>

                    <TabView.Item>
                        {
                            userData && this.state.tabIndex == 1 && (
                                <View style={{ padding: 10 }}>
                                    <FlatList
                                        data={this.state.users}
                                        renderItem={(item) => this.renderUser(item)}
                                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                    />
                                </View>
                            )
                        }
                    </TabView.Item>
                </TabView>
            </View>
        );
    }
}

export default InformationPage;
