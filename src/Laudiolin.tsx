import { useEffect, useRef } from "react";
import { SafeAreaView, StatusBar, useColorScheme, View } from "react-native";

import EnIcon from "react-native-vector-icons/Entypo";
import FaIcon from "react-native-vector-icons/FontAwesome";
import IoIcon from "react-native-vector-icons/Ionicons";

import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import { NavigationContainerRef } from "@react-navigation/core";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomTabBar, createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Alert from "@widgets/Alert";
import MediaPlayer from "@widgets/MediaPlayer";

import Home from "@app/Home";
import Login from "@ui/Login";
import Search from "@ui/Search";
import Settings from "@ui/Settings";
import NowPlaying from "@ui/NowPlaying";

import User from "@backend/user";
import Gateway from "@backend/gateway";
import { useColor, useGlobal, useSettings } from "@backend/stores";

import { DarkTheme, LightTheme } from "@style/Laudiolin";

interface IProps {
    onLoad?: () => void;
}

let firstLoad = true;
const Tab = createBottomTabNavigator();

function Laudiolin(props: IProps) {
    const global = useGlobal();
    const settings = useSettings();
    const colors = useColor();

    const navigator = useRef<NavigationContainerRef<any>>(null);
    const scheme = useColorScheme();

    const theme = settings.ui.color_theme == "System" ? scheme : settings.ui.color_theme;
    const barTheme = theme?.toLowerCase() == "dark" ? "light-content" : "dark-content";

    useEffect(() => {
        colors.change(theme?.toLowerCase() == "dark" ? DarkTheme : LightTheme);
    }, [scheme]);

    useEffect(() => {
        // Load user data which might have changed.
        User.authenticate()
            .catch(error => alert(`Failed to load user data: ${error}`));

        // Connect to the gateway.
        Gateway.setup(firstLoad)
            .catch(error => alert(`Failed to connect to the gateway: ${error}`));

        // Only run this once.
        if (firstLoad) firstLoad = false;

        return () => {
            // Disconnect when the app dismounts.
            Gateway.disconnect();
        };
    }, []);

    return (
        <>
            <StatusBar barStyle={barTheme} />

            <SafeAreaView
                style={{ height: "100%", backgroundColor: colors.primary }}
                onLayout={props.onLoad}
            >
                <Alert />

                <MenuProvider>
                    <GestureHandlerRootView>
                        {
                            global.showTrackPage && <NowPlaying navigation={navigator.current!} />
                        }
                        {
                            global.showLoginPage && <Login />
                        }

                        <View style={{
                            height: "100%",
                            backgroundColor: colors.primary,
                            display: global.showingAny() ? "none" : "flex"
                        }}>
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
                                        tabBarStyle: { backgroundColor: colors.primary },
                                    }}
                                    sceneContainerStyle={{ backgroundColor: colors.primary }}
                                >
                                    <Tab.Screen options={{ tabBarIcon: ({ focused }) =>
                                            <EnIcon size={24} name={"home"} color={focused ? colors.accent : colors.text} /> }}
                                                name={"Home"} component={Home} />
                                    <Tab.Screen options={{ tabBarIcon: ({ focused }) =>
                                            <FaIcon size={24} name={"search"} color={focused ? colors.accent : colors.text} /> }}
                                                name={"Search"} component={Search} />
                                    <Tab.Screen options={{ tabBarIcon: ({ focused }) =>
                                            <IoIcon size={24} name={"settings-sharp"} color={focused ? colors.accent : colors.text} /> }}
                                                name={"Settings"} component={Settings} />
                                </Tab.Navigator>
                            </NavigationContainer>
                        </View>
                    </GestureHandlerRootView>
                </MenuProvider>
            </SafeAreaView>
        </>
    );
}

export default Laudiolin;
