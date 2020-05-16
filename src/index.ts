import * as R from "react";

type SubscriberFunc<T> = (newState: T) => any;

interface StateWithValue<T> {
  i: {
    v: T;
    sbs: SubscriberFunc<T>[];
  };
  _set: (n: T) => any;
}

export function newRidgeState<T>(v: T): StateWithValue<T> {
  const i = { v, sbs: [] };
  return {
    i,
    _set: (ns: T) => {
      // change internal value
      i.v = ns;
      // let subscribers know value did change
      i.sbs.forEach((c: any) => c(ns));
    },
  };
}

export function useRidgeState<T>(s: StateWithValue<T>): [T, (ns: T) => any] {
  const [ls, sls] = R.useState<T>(s.i.v);

  // update local state if different
  const u = R.useCallback(
    (ns: T) => {
      if (ns !== ls) {
        sls(ns);
      }
    },
    [ls]
  );

  R.useEffect(() => {
    function c(ns: T) {
      // update local state only if it has not changed already
      // so this state will be updated if it was called outside of this hook
      u(ns);
    }

    s.i.sbs.push(c);
    return () => {
      s.i.sbs = s.i.sbs.filter((f) => f !== c);
    };
  });

  const lset = R.useCallback((ns: T) => {
    // change local state as fast as possible
    sls(ns);
    s._set(ns);
  }, []);

  return [ls, lset];
}

export function getRidgeState<T>(s: StateWithValue<T>): T {
  return s.i.v;
}

export function setRidgeState<T>(s: StateWithValue<T>, ns: T) {
  s._set(ns);
}
