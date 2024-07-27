import { Dimensions } from "react-native";

import { Colors } from "@backend/stores";

export const DarkTheme: Colors = {
    primary: "#0c0f17",
    secondary: "#1b273a",
    text: "#ffffff",
    accent: "#4e7abe",
    contrast: "#6d90ca",
    header: "#354ab2",
    red: "#d21d4f",
    gray: "#888787"
};

export const LightTheme: Colors = {
    primary: "#DDDDDD",
    secondary: "#FAFAFA",
    text: "#656565",
    accent: "#ED7D64",
    contrast: "#F5A490",
    header: "transparent",
    red: "#d21d4f",
    gray: "#888787"
};

export const value = {
    padding: 15,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
};
