export interface StateWithValue<T> {
    use: () => [T, (newState: T | ((prev: T) => T), ac?: (newState: T) => any) => any];
    useValue: () => T;
    get: () => T;
    useSelector: <TSelected = unknown>(selector: (state: T) => TSelected, equalityFn?: (left: TSelected, right: TSelected) => boolean) => TSelected;
    set: (newState: T | ((prev: T) => T), ac?: (newState: T) => any, ca?: (ns: T) => any) => any;
    reset: () => any;
}
interface Options<T> {
    onSet?: (newState: T) => any;
}
export declare function newRidgeState<T>(iv: T, o?: Options<T>): StateWithValue<T>;
export {};
