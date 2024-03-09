import { createStackNavigator } from "@react-navigation/stack";

import Summary from "@ui/Summary";
import NowPlaying from "@ui/NowPlaying";
import TextPlayground from "@ui/TextPlayground";
import TrackPlayground from "@ui/TrackPlayground";

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
            <Stack.Screen name={"Now Playing"} component={NowPlaying} />
            <Stack.Screen name={"Text Playground"} component={TextPlayground} />
            <Stack.Screen name={"Track Playground"} component={TrackPlayground} />
        </Stack.Navigator>
    );
}

export default Home;
