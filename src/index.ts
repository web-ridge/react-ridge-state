import { useState, useRef, useLayoutEffect, useEffect } from "react";

export interface StateWithValue<T> {
  use: () => [
    T,
    (newState: T | ((prev: T) => T), ac?: (newState: T) => void) => void
  ];
  useValue: () => T;
  get: () => T;
  useSelector: <TSelected = unknown>(
    selector: (state: T) => TSelected,
    equalityFn?: Comparator<TSelected>
  ) => TSelected;
  set: (
    newState: T | ((prev: T) => T), // can be the newState or a function with prevState in params and which needs to return new state
    callback?: (newState: T) => void, // callback with the newState after state has been set
    ca?: (ns: T) => void // caller is used inside react components so we can we do faster updates to the caller
  ) => void;
  reset: () => void;
}

type SubscriberFunc<T> = (newState: T) => void;

interface Options<T> {
  onSet?: (newState: T, prevState: T) => void;
}

type Comparator<TSelected = unknown> = (a: TSelected, b: TSelected) => boolean;

// React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser. We need useLayoutEffect to ensure the store
// subscription callback always has the selector from the latest render commit
// available, otherwise a store update may happen between render and the effect,
// which may cause missed updates; we also must ensure the store subscription
// is created synchronously, otherwise a store update may occur before the
// subscription is created and an inconsistent state may be observed

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" || typeof document !== "undefined"
    ? useLayoutEffect
    : useEffect;

const equ: Comparator = (a, b) => a === b;

const FR = {}; // an opaque value
function useComparator<T>(v: T, c: Comparator<T> = equ): T {
  const f = useRef(FR as T);
  let nv = f.current;

  useIsomorphicLayoutEffect(() => {
    f.current = nv;
  });

  if (f.current === FR || !c(v, f.current)) {
    nv = v;
  }

  return nv;
}

export function newRidgeState<T>(
  initialValue: T,
  options?: Options<T>
): StateWithValue<T> {
  // subscribers with callbacks for external updates
  let sb: SubscriberFunc<T>[] = [];

  // internal value of the state
  let v: T = initialValue;

  // set function
  function set(newValue: T | ((prev: T) => T), callback?: (ns: T) => void) {
    const pv = v;
    // support previous as argument to new value
    v = newValue instanceof Function ? newValue(v) : newValue;

    // let subscribers know value did change async
    setTimeout(() => {
      // call subscribers
      sb.forEach((c) => c(v));

      // callback after state is set
      callback && callback(v);

      // let options function know when state has been set
      options && options.onSet && options.onSet(v, pv);
    });
  }

  // subscribe hook
  function useSubscription(subscriber: SubscriberFunc<T>) {
    // subscribe effect
    useIsomorphicLayoutEffect(() => {
      // update local state only if it has not changed already
      // so this state will be updated if it was called outside of this hook
      sb.push(subscriber);
      return () => {
        sb = sb.filter((f) => f !== subscriber);
      };
    }, [subscriber]);
  }

  // use hook
  function use(): [
    T,
    (
      newState: T | ((prev: T) => T),
      callback?: (newState: T) => any,
      ca?: (ns: T) => any
    ) => void
  ] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [l, s] = useState<T>(v);

    // subscribe to external changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSubscription(s);

    // set callback
    return [l, set];
  }

  // select hook
  function useSelector<TSelected = unknown>(
    selector: (state: T) => TSelected,
    comparator: Comparator<TSelected> = equ
  ): TSelected {
    const [rv] = use();
    return useComparator(selector(rv), comparator);
  }

  return {
    use,
    useSelector,
    useValue: () => use()[0],
    get: () => v,
    set,
    reset: () => set(initialValue),
  };
}
