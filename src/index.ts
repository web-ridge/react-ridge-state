import * as R from "react";

type UnsubscribeFunc = () => void;

export interface StateWithValue<T> {
  use: () => [
    T,
    (newState: T | ((prev: T) => T), ac?: (newState: T) => any) => any
  ];
  useValue: () => T;
  get: () => T;
  useSelector: <TSelected = unknown>(
    selector: (state: T) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
  ) => TSelected;
  set: (
    newState: T | ((prev: T) => T), // can be the newState or a function with prevState in params and which needs to return new state
    ac?: (newState: T) => any, // callback with the newState after state has been set
    ca?: (ns: T) => any // caller is used inside react components so we can we do faster updates to the caller
  ) => any;
  reset: () => any;
  subscribe: (ca: SubscriberFunc<T>) => UnsubscribeFunc;
}

export type ComputedRidgeState<T> = Omit<StateWithValue<T>, 'use' | 'set' | 'reset'>;

type SubscriberFunc<T> = (newState: T) => any;

interface Options<T> {
  onSet?: (newState: T) => any;
}

export function newRidgeState<T>(iv: T, o?: Options<T>): StateWithValue<T> {
  // subscribers with callbacks for external updates
  let sb: SubscriberFunc<T>[] = [];

  // internal value of the state
  let v: T = iv;

  // set function
  function set(ns: T | ((prev: T) => T), ac?: (ns: T) => any) {
    // support previous as argument to new value
    v = (ns instanceof Function ? ns(v) : ns) as T;

    // call subscribers
    sb.forEach((c: any) => c(v));

    // let subscribers know value did change async
    setTimeout(() => {
      // callback after state is set
      ac && ac(v);

      // let options function know when state has been set
      o && o.onSet && o.onSet(v);
    });
  }

  function subscribe(ca: SubscriberFunc<T>) {
    sb.push(ca);

    return () => {
      sb = sb.filter((f) => f !== ca);
    };
  }

  // subscribe hook
  function sub(ca: SubscriberFunc<T>) {
    R.useEffect(() => {
      // update local state only if it has not changed already
      // so this state will be updated if it was called outside of this hook
      const unsubscribe = subscribe(ca);

      return unsubscribe;
    }, [ca]);
  }

  // use hook
  function use(): [
    T,
    (
      newState: T | ((prev: T) => T),
      ac?: (newState: T) => any,
      ca?: (ns: T) => any
    ) => any
  ] {
    let [l, s] = R.useState<T>(v);

    // subscribe to external changes
    sub(s);

    // set callback
    return [l, set];
  }

  // select hook
  function useSelector<TSelected = unknown>(
    se: (state: T) => TSelected,
    eq = (a: TSelected, b: TSelected): boolean => a === b
  ): TSelected {
    // selected value
    let [l, s] = R.useState<TSelected>(se(v));

    let c = R.useCallback(
      (ns: T) => {
        // select new value
        let n = se(ns);

        // if not equal => update
        !eq(l, n) && s(n);
      },
      [l]
    );

    // subscribe to changed and call c with the new state if changed
    sub(c);

    return l;
  }

  return {
    use,
    useSelector,
    useValue: () => use()[0],
    get: () => v,
    set,
    reset: () => set(iv),
    subscribe,
  };
}

export function computedRidgeState<T, V>(
  state: ComputedRidgeState<T>,
  cb: (prev: T) => V
): ComputedRidgeState<V> {
  const computedValue = newRidgeState(cb(state.get()));

  state.subscribe((newValue) => {
    computedValue.set(cb(newValue));
  });

  return {
    get: computedValue.get,
    useSelector: computedValue.useSelector,
    useValue: computedValue.useValue,
    subscribe: computedValue.subscribe,
  };
}
