export interface StateWithValue<T> {
    use: () => [
        T,
        (newState: T | ((prev: T) => T), ac?: (newState: T) => void) => void
    ];
    useValue: () => T;
    get: () => T;
    useSelector: <TSelected = unknown>(selector: (state: T) => TSelected, equalityFn?: Comparator<TSelected>) => TSelected;
    set: (newState: T | ((prev: T) => T), ac?: (newState: T) => void, ca?: (ns: T) => void) => void;
    reset: () => void;
}
interface Options<T> {
    onSet?: (newState: T, prevState: T) => any;
}
declare type Comparator<TSelected = unknown> = (a: TSelected, b: TSelected) => boolean;
export declare function newRidgeState<T>(iv: T, o?: Options<T>): StateWithValue<T>;
export {};
