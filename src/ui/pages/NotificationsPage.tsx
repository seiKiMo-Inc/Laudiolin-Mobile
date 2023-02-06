import React from "react";
import { View } from "react-native";

import BasicText from "@components/common/BasicText";

class NotificationsPage extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View>
                <BasicText text="Notifications" />
            </View>
        );
    }
}

export default NotificationsPage;
