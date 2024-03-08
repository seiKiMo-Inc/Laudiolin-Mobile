import { createStackNavigator } from "@react-navigation/stack";

import Summary from "@ui/Summary";
import TextPlayground from "@ui/TextPlayground";

import style from "@style/Home";

const Stack = createStackNavigator();

function Home() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: style.Home
            }}
            initialRouteName={"Summary"}
        >
            <Stack.Screen name={"Summary"} component={Summary} />
            <Stack.Screen name={"Text Playground"} component={TextPlayground} />
        </Stack.Navigator>
    );
}

export default Home;
