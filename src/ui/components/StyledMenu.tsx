import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import StyledText from "@components/StyledText";

import { colors } from "@style/Laudiolin";

interface OptionProp {
    text: string;
    icon?: ReactNode;

    onPress?: () => void;
    closeOnPress?: boolean;
}

interface IProps {
    children?: ReactNode | ReactNode[]; // Children is the trigger object.

    opened?: boolean;
    close?: () => void;

    options: OptionProp[];
    closeOnPress?: boolean;
}

function StyledMenu(props: IProps) {
    return (
        <Menu
            style={style.StyledMenu}
            opened={props.opened}
            onBackdropPress={props.close}
        >
            <MenuTrigger
                customStyles={{ triggerOuterWrapper: style.StyledMenu_Trigger }}
            >
                {props.children}
            </MenuTrigger>

            <MenuOptions customStyles={{
                optionsContainer: style.StyledMenu_Container
            }}>
                {
                    props.options.map((option, index) => (
                        <MenuOption
                            key={index} onSelect={() => {
                                option.onPress?.();
                                if (props.closeOnPress ?? option.closeOnPress) {
                                    props.close?.();
                                }
                            }}
                        >
                            <View style={style.StyledMenu_Option}>
                                <StyledText text={option.text} />
                                {option.icon}
                            </View>
                        </MenuOption>
                    ))
                }
            </MenuOptions>
        </Menu>
    );
}

export default StyledMenu;

const style = StyleSheet.create({
    StyledMenu: {
        position: "absolute",
        right: 0
    },
    StyledMenu_Trigger: {
        height: "100%"
    },
    StyledMenu_Container: {
        backgroundColor: colors.secondary,
        borderColor: colors.contrast,
        borderRadius: 10,
        borderWidth: 1,
        padding: 2
    },
    StyledMenu_Option: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    }
});
