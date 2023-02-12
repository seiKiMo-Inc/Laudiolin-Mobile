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

interface IState {
    notifications: InAppNotificationData[];
    tabIndex: number;
    users: (OnlineUser|OfflineUser)[];
}

class InformationPage extends React.Component<any, IState> {
    /**
     * Updates the notifications.
     */
    update = (notifications: InAppNotificationData[]) =>
        this.setState({ notifications });

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

    componentDidMount() {
        registerListener(this.update);

        userData && getAvailableUsers().then(async online => {
            let recents = await getRecentUsers();

            online = online.filter(user => user.userId != userData?.userId);
            recents = recents.filter(user => user.userId != userData?.userId);

            this.setState({ users: [...online, ...recents] });
        });
    }

    componentWillUnmount() {
        unregisterListener(this.update);
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