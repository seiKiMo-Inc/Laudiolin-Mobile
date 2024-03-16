import { useRef } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";

import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import { NavigationContainerRef } from "@react-navigation/core";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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

    const navigator = useRef<NavigationContainerRef<any>>(null);

    return (
        <>
            <StatusBar barStyle={"light-content"} />

            <SafeAreaView style={style.App} onLayout={props.onLoad}>
                <GestureHandlerRootView>
                    {
                        global.showTrackPage && <NowPlaying navigation={navigator.current!} />
                    }
                    {
                        global.showLoginPage && <Login />
                    }
                    <View style={{
                        ...style.App,
                        display: global.showingAny() ? "none" : "flex"
                    }}>
                        <MenuProvider>
                            <NavigationContainer ref={navigator}>
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
                        </MenuProvider>
                    </View>
                </GestureHandlerRootView>
            </SafeAreaView>
        </>
    );
}

export default Laudiolin;
