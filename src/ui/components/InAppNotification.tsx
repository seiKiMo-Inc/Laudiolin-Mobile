import React from "react";
import { Dimensions, View, TouchableHighlight } from "react-native";

import { InAppNotificationData } from "@backend/types";

import BasicText from "@components/common/BasicText";
import { Icon } from "@rneui/themed";

interface IProps {
    notification: InAppNotificationData;
}

class InAppNotification extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    getNotificationDate() {
        const { notification } = this.props;
        const date = new Date(notification.date);
        const now = new Date();

        const diff = now.getTime() - date.getTime();
        const diffDays = Math.floor(diff / (1000 * 3600 * 24));
        const diffHours = Math.floor(diff / (1000 * 3600));
        const diffMinutes = Math.floor(diff / (1000 * 60));
        const diffSeconds = Math.floor(diff / (1000));

        if (diffDays > 0) return `${diffDays} days ago`;
        else if (diffHours > 0) return `${diffHours} hours ago`;
        else if (diffMinutes > 1) return `${diffMinutes} minutes ago`;
        else if (diffMinutes === 1) return `${diffMinutes} minute ago`;
        else if (diffSeconds > 0) return `${diffSeconds} seconds ago`;
        else return "Just now";
    }

    render() {
        return (
            <TouchableHighlight onPress={this.props.notification.onPress} underlayColor={"transparent"}>
                <View style={{ width: Dimensions.get("window").width, flexDirection: "row", gap: 10, justifyContent: "center", padding: 10 }}>
                    <Icon
                        name={this.props.notification.icon}
                        size={25}
                        type={"material"}
                        color={"#FFFFFF"}
                        containerStyle={{ borderRadius: 50, padding: 10, backgroundColor: "#0089d3" }}
                    />

                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <BasicText text={this.props.notification.message} />
                        <BasicText text={this.getNotificationDate()} style={{ fontSize: 12, color: "#bebebe" }} />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

export default InAppNotification;
