import { createStackNavigator } from "@react-navigation/stack";

import NamedList from "@components/NamedList";

import Debug from "@ui/Debug";
import Summary from "@ui/Summary";
import Playlist from "@ui/Playlist";
import TextPlayground from "@ui/TextPlayground";
import TrackPlayground from "@ui/TrackPlayground";

import { useColor } from "@backend/stores";

const Stack = createStackNavigator();

function Home() {
    const colors = useColor();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    height: "100%",
                    backgroundColor: colors.primary
                }
            }}
            initialRouteName={"Summary"}
        >
            <Stack.Screen name={"Named List"} component={NamedList} />
            <Stack.Screen name={"Debug"} component={Debug} />
            <Stack.Screen name={"Summary"} component={Summary} />
            <Stack.Screen name={"Playlist"} component={Playlist} />
            <Stack.Screen name={"Text Playground"} component={TextPlayground} />
            <Stack.Screen name={"Track Playground"} component={TrackPlayground} />
        </Stack.Navigator>
    );
}

export default Home;
