import { useCallback, useEffect, useState } from "react";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import {
    Poppins_400Regular, Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import Laudiolin from "@app/Laudiolin";

function App() {
    const [loaded, setLoaded] = useState(false);
    const [rendered, setRendered] = useState(false);

    // Load app assets & fonts.
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold
    });

    // Wait for our fonts to load.
    useEffect(() => {
        if (fontsLoaded) setLoaded(true);
    }, [fontsLoaded]);

    // Hide splash screen when the app is done loading.
    const onLoad = useCallback(async() => {
        if (rendered) return;

        if (loaded) {
            await SplashScreen.hideAsync();
            setRendered(true);
        }
    }, [loaded]);

    return loaded ? <Laudiolin onLoad={onLoad} /> : null;
}

// noinspection JSUnusedGlobalSymbols
export default App;
