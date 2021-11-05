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
    subscribe(subscriber: SubscriberFunc<T>): () => void;
}
declare type SubscriberFunc<T> = (newState: T, previousState: T) => void;
interface Options<T> {
    onSet?: SubscriberFunc<T>;
}
declare type Comparator<TSelected = unknown> = (a: TSelected, b: TSelected) => boolean;
export declare function newRidgeState<T>(initialValue: T, options?: Options<T>): StateWithValue<T>;
export {};
