import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

import SelectDropdown from "react-native-select-dropdown";

interface IProps {
    initial: string;
    options: string[];

    icon?: React.ReactNode;
    select?: (value: string) => void;

    textStyle?: StyleProp<TextStyle>;
    rowTextStyle?: StyleProp<TextStyle>;
    menuStyle?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
}

class BasicDropdown extends React.Component<IProps, never> {
    constructor(props: any) {
        super(props);
    }

    /**
     * Invoked when an item is selected.
     * @param selectedItem The selected item.
     * @param index The index of the selected item.
     */
    onSelect(selectedItem: string, index: number): void {
        this.props.select?.(selectedItem);
    }

    /**
     * Invoked when the text of the search input changes.
     * @param selectedItem The selected item.
     * @param index The index of the selected item.
     * @return The new text.
     */
    getNewText(selectedItem: string, index: number): string {
        return this.props.options[index];
    }

    render() {
        return (
            <SelectDropdown
                buttonTextStyle={{
                    ...this.props.textStyle as object,
                    fontFamily: "Poppins"
                }}
                buttonStyle={this.props.buttonStyle}
                dropdownStyle={this.props.menuStyle}
                rowTextStyle={this.props.rowTextStyle}

                data={this.props.options}
                defaultButtonText={this.props.initial}
                onSelect={(s, i) => this.onSelect(s, i)}
                buttonTextAfterSelection={(s, i) => this.getNewText(s, i)}
                rowTextForSelection={item => item}
                onChangeSearchInputText={() => null}
            />
        );
    }
}

export default BasicDropdown;
