import { useEffect, useState } from "react";

import TrackPlayer, { Track } from "react-native-track-player";
import { EventRegister } from "react-native-event-listeners";

import { TrackInfo } from "@backend/types";

function useQueue(): TrackInfo[] {
    const [queue, setQueue] = useState<TrackInfo[]>([]);

    useEffect(() => {
        TrackPlayer.getQueue().then(tracks => {
            setQueue(tracks.map(track => track.source as TrackInfo));
        });

        const subscription = EventRegister.addEventListener(
            "player:updateQueue", (queue: Track[]) => {
                setQueue(queue.map(track => track.source as TrackInfo));
            });

        return () => {
            EventRegister.removeEventListener(subscription as string);
        };
    }, []);

    return queue;
}

export default useQueue;
