import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";

import SelectDropdown from "react-native-select-dropdown";

import { useColor } from "@backend/stores";

interface IProps {
    default: string;
    options: string[];

    style?: StyleProp<ViewStyle> | any;
    textStyle?: StyleProp<TextStyle> | any;
    buttonStyle?: StyleProp<ViewStyle> | any;
    menuStyle?: StyleProp<ViewStyle> | any;
    rowTextStyle?: StyleProp<ViewStyle> | any;

    onSelect: (value: string, index: number) => void;
}

function StyledDropdown(props: IProps) {
    const colors = useColor();

    return (
        <SelectDropdown
            data={props.options}
            defaultButtonText={props.default}
            onSelect={props.onSelect}
            rowTextForSelection={item => item}
            buttonTextAfterSelection={(_, index) => props.options[index]}
            dropdownStyle={{
                borderRadius: 10,
                backgroundColor: colors.primary
            }}
            buttonTextStyle={{
                fontFamily: "Poppins400_Regular",
                color: colors.text,
                ...props.textStyle,
            }}
            buttonStyle={{
                borderRadius: 15,
                backgroundColor: colors.accent,
                ...props.buttonStyle
            }}
            rowStyle={{
                backgroundColor: colors.secondary,
                borderBottomColor: "transparent",
                ...props.menuStyle
            }}
            rowTextStyle={{
                fontFamily: "Poppins400_Regular",
                color: colors.text,
                ...props.rowTextStyle
            }}
        />
    );
}

export default StyledDropdown;
