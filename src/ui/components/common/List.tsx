import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";

export interface ListRenderItem<ItemT> {
    item: ItemT;
    index: number;
}

interface IProps {
    data: ReadonlyArray<any>;
    renderItem: (info: ListRenderItem<any>) => React.ReactElement | null;
    style?: StyleProp<ViewStyle>;
}
class List extends React.Component<IProps, never> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View style={this.props.style}>
                {this.props.data.map((item, index) => {
                    return this.props.renderItem({ item, index });
                })}
            </View>
        )
    }
}

export default List;
