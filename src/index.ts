import * as R from "react";

interface StateWithValue<T> {
  use: () => [
    T,
    (newState: T | ((prev: T) => T), ac?: (newState: T) => any) => any
  ];
  useValue: () => T;
  get: () => T;
  useSelector: <TSelected = unknown>(
    selector?: (state: T) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
  ) => TSelected;
  set: (
    newState: T | ((prev: T) => T), // can be the newState or a function with prevState in params and which needs to return new state
    ac?: (newState: T) => any, // callback with the newState after state has been set
    ca?: (ns: T) => any // caller is used inside react components so we can we do faster updates to the caller
  ) => any;
}

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

    // let subscribers know value did change async
    setTimeout(() => {
      // call subscribers which are not the caller
      sb.forEach((c: any) => c(v));

      // callback after state is set
      ac && ac(v);

      // let options function know when state has been set
      o && o.onSet && o.onSet(v);
    });
  }

  // subscribe hook
  function subscribe(ca: SubscriberFunc<T>) {
    R.useEffect(() => {
      // update local state only if it has not changed already
      // so this state will be updated if it was called outside of this hook
      sb.push(ca);
      return () => {
        sb = sb.filter((f) => f !== ca);
      };
    }, []);
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
    let [l, sl] = R.useState<T>(v);

    // subscribe to external changes
    subscribe(sl);

    // notify external subscribers and components
    let c = R.useCallback((ns, ca) => set(ns, ca), [sl]);
    return [l, c];
  }

  // use value
  function useValue(): T {
    let [l, sl] = R.useState<T>(v);
    // subscribe to external changes
    subscribe(sl);
    return l;
  }

  // select hook
  function useSelector<TSelected = unknown>(
    selector?: (state: T) => TSelected,
    eq = (a: TSelected, b: TSelected): boolean => a === b
  ): TSelected {
    // selected value
    let [l, sl] = R.useState<TSelected>(selector(v));

    let c = R.useCallback(
      (ns: T) => {
        // select new value
        let n = selector(ns);

        // if not equal let's update
        !eq(l, n) && sl(n);
      },
      [sl]
    );

    // subscribe to changed and call c with the new state if changed
    subscribe(c);

    return l;
  }

  return {
    use,
    useSelector,
    useValue,
    get: () => v,
    set,
  };
}
