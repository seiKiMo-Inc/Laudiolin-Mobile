import { StyleSheet } from 'react-native';

export const ProgressBarStyle = StyleSheet.create({
    track: {
        height: 2,
        borderRadius: 1,
    },
    thumb: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    text: {
        marginTop: -10,
        fontSize: 12,
        textAlign: 'center',
        color: "#a1a1a1"
    }
});
