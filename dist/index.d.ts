declare type SubscriberFunc<T> = (newState: T) => any;
interface StateWithValue<T> {
    i: {
        v: T;
        sbs: SubscriberFunc<T>[];
    };
    _set: (n: T) => any;
}
export declare function newRidgeState<T>(defaultState: T): StateWithValue<T>;
export declare function useRidgeState<T>(s: StateWithValue<T>): [T, (ns: T) => any];
export declare function getRidgeState<T>(s: StateWithValue<T>): T;
export declare function setRidgeState<T>(s: StateWithValue<T>, ns: T): void;
export {};
