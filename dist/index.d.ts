declare type SubscriberFunc<T> = (newState: T) => any;
interface StateWithValue<T> {
    i: {
        v: T;
        subs: SubscriberFunc<T>[];
    };
    use: () => [T, (newState: T) => any];
    useValue: () => T;
    get: () => T;
    set: (newState: T, ac?: (newState: T) => any) => any;
}
export declare function newRidgeState<T>(v: T): StateWithValue<T>;
export {};
