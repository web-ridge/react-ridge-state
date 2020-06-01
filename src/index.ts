import * as R from "react";

type SubscriberFunc<T> = (newState: T) => any;

interface StateWithValue<T> {
  use: () => [T, (newState: T) => any];
  useValue: () => T;
  get: () => T;
  set: (
    newState: T | ((prev: T) => T),
    ac?: (newState: T) => any,
    ca?: (ns: T) => any
  ) => any;
}

interface Options<T> {
  onSet?: (newState: T) => any;
}

export function newRidgeState<T>(iv: T, o: Options<T>): StateWithValue<T> {
  // subscribers with callbacks for external updates
  let sb: SubscriberFunc<T>[] = [];

  // internal value of the state
  let v: T = iv;

  // set function
  let set = (
    ns: T | ((prev: T) => T),
    ac?: (ns: T) => any,
    ca?: (ns: T) => any
  ) => {
    // support previous as argument to new value
    //@ts-ignore
    v = (v instanceof Function ? ns(v) : ns) as T;

    // notify caller subscriber direct
    ca(v);

    // let subscribers know value did change async
    setTimeout(() => {
      // call subscribers which are not the caller
      sb.forEach((c: any) => c !== ca && c(v));

      // callback after state is set
      ac && ac(v);

      // let options function know when state has been set
      o.onSet && o.onSet(v);
    });
  };

  // use hook
  let use = (): [T, (newState: T) => any] => {
    let [l, sl] = R.useState<T>(v);

    // update local state if different
    let u = R.createRef((ns: T) => sl(ns));

    R.useEffect(() => {
      // update local state only if it has not changed already
      // so this state will be updated if it was called outside of this hook
      sb.push(u.current);
      return () => {
        sb = sb.filter((f) => f !== u.current);
      };
    });

    // notify external subscribers and components
    let c = R.useCallback((ns: T) => set(ns, null, u.current), [u]);

    return [l, c];
  };

  return {
    use,
    useValue: () => {
      let [uv] = use();
      return uv;
    },
    get: () => v,
    set,
  };
}
