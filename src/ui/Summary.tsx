import { View } from "react-native";

import { NavigationProp } from "@react-navigation/native";

import StyledButton from "@components/StyledButton";

import style from "@style/Summary";
import { colors } from "@style/Laudiolin";

interface IProps {
    navigation: NavigationProp<any>;
}

function Summary(props: IProps) {
    return (
        <View style={{ backgroundColor: "#a8bbe6" }}>
            <StyledButton
                text={"Text Playground"}
                onPress={() => props.navigation.navigate("Text Playground")}
            />
        </View>
    );
}

export default Summary;
