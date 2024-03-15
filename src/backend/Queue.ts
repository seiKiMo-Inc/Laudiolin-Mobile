import { create, StoreApi, UseBoundStore } from "zustand";

type Queue<T> = {
    backing: T[];

    isEmpty(): boolean;
    enqueue(value: T | T[]): void;
    dequeue(): T;
    values(): T[];
    clear(): void;
    shuffle(): void;
    size(): number;
    peek(): T | undefined;
};

/**
 * Creates a queue store.
 */
function createQueue<T>(): UseBoundStore<StoreApi<Queue<T>>> {
    return create<Queue<T>>((set, get) => ({
        backing: [],
        isEmpty: () => get().backing.length == 0,
        enqueue: (value: T | T[]) => set({
            backing: [...get().backing, ...(Array.isArray(value) ? value : [value])]
        }),
        dequeue: () => {
            const value = get().backing[0];
            set({ backing: get().backing.slice(1) });
            return value;
        },
        values: () => get().backing,
        clear: () => set({ backing: [] }),
        shuffle: () => {
            let backing = get().backing;
            backing = backing.sort(() => Math.random() - 0.5);
            set({ backing });
        },
        size: () => get().backing.length,
        peek: () => {
            const backing = get().backing;
            return backing.length == 0 ? undefined : backing[0];
        }
    }));
}

export default createQueue;
