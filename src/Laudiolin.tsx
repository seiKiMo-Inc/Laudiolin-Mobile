import { SafeAreaView, StatusBar } from "react-native";

import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import { HomeIcon, SearchIcon, SettingsIcon } from "@ui/Icons";

import Home from "@app/Home";
import Login from "@ui/Login";
import Search from "@ui/Search";
import Settings from "@ui/Settings";
import NowPlaying from "@ui/NowPlaying";
import MediaPlayer from "@widgets/MediaPlayer";

import { useGlobal } from "@backend/stores";

import style from "@style/Laudiolin";

interface IProps {
    onLoad?: () => void;
}

const Tab = createBottomTabNavigator();

function Laudiolin(props: IProps) {
    const global = useGlobal();

    return (
        <>
            <StatusBar barStyle={"light-content"} />

            <SafeAreaView style={style.App} onLayout={props.onLoad}>
                {
                    global.showTrackPage && <NowPlaying />
                }
                {
                    global.showLoginPage && <Login />
                }

                {
                    !global.showingAny() && (
                        <NavigationContainer>
                            <Tab.Navigator
                                tabBar={props => (
                                    <>
                                        <MediaPlayer />
                                        <BottomTabBar {...props} />
                                    </>
                                )}
                                screenOptions={{
                                    headerShown: false,
                                    tabBarShowLabel: false,
                                    tabBarStyle: style.App_TabBar,
                                }}
                                sceneContainerStyle={style.App_Scene}
                            >
                                <Tab.Screen options={{ tabBarIcon: ({ focused }) => HomeIcon(focused) }}
                                            name={"Home"} component={Home} />
                                <Tab.Screen options={{ tabBarIcon: ({ focused }) => SearchIcon(focused) }}
                                            name={"Search"} component={Search} />
                                <Tab.Screen options={{ tabBarIcon: ({ focused }) => SettingsIcon(focused) }}
                                            name={"Settings"} component={Settings} />
                            </Tab.Navigator>
                        </NavigationContainer>
                    )
                }
            </SafeAreaView>
        </>
    );
}

export default Laudiolin;
