import React from "react";
import { Dimensions, View } from "react-native";

import BasicText from "@components/common/BasicText";

class NotificationsPage extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View style={{ height: "100%", width: Dimensions.get("window").width, justifyContent: "center", alignItems: "center" }}>
                <BasicText text="Notifications" />
                <BasicText text="Doesnt exist yet lol" />
            </View>
        );
    }
}

export default NotificationsPage;
