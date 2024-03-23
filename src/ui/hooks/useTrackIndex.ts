import { useEffect, useState } from "react";
import TrackPlayer, { Event } from "react-native-track-player";

function useTrackIndex(): number {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        TrackPlayer.getActiveTrackIndex()
            .then(index => setIndex(index ?? 0));

        const subscription = TrackPlayer.addEventListener(
            Event.PlaybackActiveTrackChanged,
            ({ index }) => {
                setIndex(index ?? 0);
            });

        return () => {
            subscription.remove();
        };
    }, []);

    return index;
}

export default useTrackIndex;
