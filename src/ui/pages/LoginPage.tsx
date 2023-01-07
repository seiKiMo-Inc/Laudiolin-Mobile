import React from "react";
import { Button, Text } from "react-native";

import { navigate } from "@backend/navigation";

class SearchPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                <Text>this is the login page</Text>
                <Button title={"Go Back"} onPress={() => navigate("Home")} />
            </>
        );
    }
}

export default SearchPage;
