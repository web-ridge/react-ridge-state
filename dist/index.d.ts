import { SetStateAction } from "react";
declare type Set<T> = (newState: SetStateAction<T>, callback?: (newState: T) => void) => void;
declare type UseSelector<T> = <TSelected = unknown>(selector: (state: T) => TSelected, equalityFn?: Comparator<TSelected>) => TSelected;
export interface StateWithValue<T> {
    use: () => [T, Set<T>];
    useValue: () => T;
    get: () => T;
    useSelector: UseSelector<T>;
    set: Set<T>;
    reset: () => void;
}
interface Options<T> {
    onSet?: (newState: T, prevState: T) => void;
}
declare type Comparator<TSelected = unknown> = (a: TSelected, b: TSelected) => boolean;
export declare function newRidgeState<T>(initialValue: T, options?: Options<T>): StateWithValue<T>;
export {};
