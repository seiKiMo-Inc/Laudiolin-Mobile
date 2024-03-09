import AdIcon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";

function BackButton({ navigation }: { navigation: NavigationProp<any> }) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
        >
            <AdIcon name={"left"} size={28} color={"white"} />
        </TouchableOpacity>
    );
}

export default BackButton;
