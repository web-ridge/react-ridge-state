import * as R from "react";
import e from "./e";

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
    ac?: (newState: T) => void, // callback with the newState after state has been set
    ca?: (ns: T) => void // caller is used inside react components so we can we do faster updates to the caller
  ) => void;
  reset: () => void;
}

type SubscriberFunc<T> = (newState: T) => any;

interface Options<T> {
  onSet?: (newState: T, prevState: T) => any;
}

type Comparator<TSelected = unknown> = (a: TSelected, b: TSelected) => boolean;

let equ: Comparator = (a, b) => a === b;

let FR = {}; // an opaque value
function me<T>(v: T, c: Comparator<T> = equ): T {
  let f = R.useRef(FR as T);
  let nv = f.current;

  e(() => {
    f.current = nv;
  });

  if (f.current === FR || !c(v, f.current)) {
    nv = v;
  }

  return nv;
}

export function newRidgeState<T>(iv: T, o?: Options<T>): StateWithValue<T> {
  // subscribers with callbacks for external updates
  let sb: SubscriberFunc<T>[] = [];

  // internal value of the state
  let v: T = iv;

  // set function
  function set(ns: T | ((prev: T) => T), ac?: (ns: T) => any) {
    let pv = v;
    // support previous as argument to new value
    v = (ns instanceof Function ? ns(v) : ns) as T;

    // let subscribers know value did change async
    setTimeout(() => {
      // call subscribers
      sb.forEach((c: any) => c(v));

      // callback after state is set
      ac && ac(v);

      // let options function know when state has been set
      o && o.onSet && o.onSet(v, pv);
    });
  }

  // subscribe hook
  function sub(c: SubscriberFunc<T>) {
    // subscribe effect
    e(() => {
      // update local state only if it has not changed already
      // so this state will be updated if it was called outside of this hook
      sb.push(c);
      return () => {
        sb = sb.filter((f) => f !== c);
      };
    }, [c]);
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
    eq = equ as any
  ): TSelected {
    const [l, s] = R.useState<TSelected>();
    sub((nv) => {
      const v = se(nv);
      if (!eq(v, l)) s(v);
    });
    return l;
  }

  return {
    use,
    useSelector,
    useValue: () => use()[0],
    get: () => v,
    set,
    reset: () => set(iv),
  };
}
