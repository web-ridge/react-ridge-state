import * as R from "react";

// global reference to store things in React (Native)
// @ts-ignore
const r: any = window || global;

interface StateWithValue<T> {
  i: {
    // internal
    v: T;
  };
  sk: string;
  _set: (n: T) => any;
}

export function newRidgeState<T>({
  key,
  defaultState,
}: {
  key: string;
  defaultState: T;
}): StateWithValue<T> {
  // subscriber key
  const sk = `rrs_${key}`;
  r[sk] = [];

  const i = { v: defaultState };
  return {
    i,
    sk,
    _set: (ns: T) => {
      i.v = ns;
      // let subscribers know value did change
      r[sk].forEach((c: any) => c(ns));
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

    const sk = s.sk;
    // @ts-ignore
    r[sk].push(c);
    return () => {
      // @ts-ignore
      r[sk] = r[sk].filter((f: () => any) => f !== c);
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
