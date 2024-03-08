import EnIcon from "react-native-vector-icons/Entypo";
import FaIcon from "react-native-vector-icons/FontAwesome";
import IoIcon from "react-native-vector-icons/Ionicons";

import { colors } from "@style/Laudiolin";

export const HomeIcon = (focused: boolean) =>
    <EnIcon size={24} name={"home"}
            color={focused ? colors.accent : "white"} />;
export const SearchIcon = (focused: boolean) =>
    <FaIcon size={24} name={"search"}
            color={focused ? colors.accent : "white"} />;
export const SettingsIcon = (focused: boolean) =>
    <IoIcon size={24} name={"settings-sharp"}
            color={focused ? colors.accent : "white"} />;
