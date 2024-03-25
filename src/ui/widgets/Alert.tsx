import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, Alert as RNAlert } from "react-native";

import { create } from "zustand";

import StyledText from "@components/StyledText";

import { useColor } from "@backend/stores";

const store = create(() => "");

/**
 * Alert the user with a message.
 *
 * @param message The message to alert the user with.
 * @param native Should the native alert be used instead?
 */
export function alert(message: string, native: boolean = false) {
    if (native) {
        RNAlert.alert(message);
    } else {
        store.setState(message);
    }
}

function Alert() {
    const colors = useColor();
    const alert = store();

    useEffect(() => {
        let task = setTimeout(() => {
            store.setState("");
        }, 5e3);

        return () => clearTimeout(task);
    }, [alert]);

    return alert.length != 0 && (
        <TouchableOpacity
            style={{
                ...style.Alert,
                backgroundColor: colors.secondary
            }}
            activeOpacity={0.8}
            onPressOut={() => store.setState("")}
        >
            <StyledText ticker text={alert} />
        </TouchableOpacity>
    );
}

export default Alert;

const style = StyleSheet.create({
    Alert: {
        position: "absolute",
        width: "95%",
        bottom: 65,
        height: 40,
        zIndex: 100,
        borderRadius: 10,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    }
});
