import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";

import SelectDropdown from "react-native-select-dropdown";

import { colors } from "@style/Laudiolin";

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
    return (
        <SelectDropdown
            data={props.options}
            defaultButtonText={props.default}
            onSelect={props.onSelect}
            rowTextForSelection={item => item}
            buttonTextAfterSelection={(_, index) => props.options[index]}
            dropdownStyle={style.StyledDropdown}
            buttonTextStyle={{
                ...style.StyledDropdown_Text,
                ...props.textStyle,
            }}
            buttonStyle={{
                ...style.StyledDropdown_Button,
                ...props.buttonStyle
            }}
            rowStyle={{
                ...style.StyledDropdown_Row,
                ...props.menuStyle
            }}
            rowTextStyle={{
                ...style.StyledDropdown_Text,
                ...props.rowTextStyle
            }}
        />
    );
}

export default StyledDropdown;

const style = StyleSheet.create({
    StyledDropdown: {
        borderRadius: 10,
        backgroundColor: colors.primary
    },
    StyledDropdown_Text: {
        fontFamily: "Poppins400_Regular",
        color: "white"
    },
    StyledDropdown_Button: {
        borderRadius: 15,
        backgroundColor: colors.accent
    },
    StyledDropdown_Row: {
        backgroundColor: colors.secondary,
        borderBottomColor: "transparent"
    }
});
