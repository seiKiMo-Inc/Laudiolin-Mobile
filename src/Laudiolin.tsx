import { Text, View } from "react-native";

interface IProps {
    onLoad?: () => void;
}

function Laudiolin(props: IProps) {
    return (
        <View onLayout={props.onLoad}>
            <Text>Hello World!</Text>
        </View>
    );
}

export default Laudiolin;
