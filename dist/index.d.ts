interface StateWithValue<T> {
    use: () => [T, (newState: T) => any];
    useValue: () => T;
    get: () => T;
    set: (newState: T | ((prev: T) => T), ac?: (newState: T) => any, ca?: (ns: T) => any) => any;
}
interface Options<T> {
    onSet?: (newState: T) => any;
}
export declare function newRidgeState<T>(iv: T, o: Options<T>): StateWithValue<T>;
export {};
