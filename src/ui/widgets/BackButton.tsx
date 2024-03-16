import { TouchableOpacity } from "react-native";

import AdIcon from "react-native-vector-icons/AntDesign";

import { NavigationProp } from "@react-navigation/native";

import { useColor } from "@backend/stores";

function BackButton({ navigation }: { navigation: NavigationProp<any> }) {
    const colors = useColor();

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
        >
            <AdIcon name={"left"} size={28} color={colors.text} />
        </TouchableOpacity>
    );
}

export default BackButton;
