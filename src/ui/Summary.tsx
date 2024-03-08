import { View } from "react-native";

import { NavigationProp } from "@react-navigation/native";

import StyledButton from "@components/StyledButton";

import style from "@style/Summary";
import { colors } from "@style/Laudiolin";

interface IProps {
    navigation: NavigationProp<any>;
}

function Summary({ navigation }: IProps) {
    return (
        <View style={{ gap: 35 }}>
            <StyledButton
                text={"Text Playground"}
                onPress={() => navigation.navigate("Text Playground")}
            />

            <StyledButton
                text={"Track Playground"}
                onPress={() => navigation.navigate("Track Playground")}
            />
        </View>
    );
}

export default Summary;
