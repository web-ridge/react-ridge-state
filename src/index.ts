import { useEffect, useState, useCallback } from "react";

// global reference to store things in React (Native)
// @ts-ignore
const r: any = window || global;

interface StateWithValue<T> {
  internal: {
    value: T;
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
  const sk = `wr_subscribers_${key}`;
  r[sk] = [];

  const internal = { value: defaultState };
  return {
    internal,
    sk,
    _set: (newState: T) => {
      internal.value = newState;
      // let subscribers know value did change
      r[sk].forEach((callback: any) => callback(newState));
    },
  };
}

export function useRidgeState<T>(
  state: StateWithValue<T>
): [T, (newState: T) => any] {
  const [localState, setLocalState] = useState<T>(state.internal.value);

  const updateLocalStateIfDifferent = useCallback(
    (newState: T) => {
      if (newState !== localState) {
        setLocalState(newState);
      }
    },
    [localState]
  );

  useEffect(() => {
    function stateChanged(newState: T) {
      // update local state only if it has not changed already
      // so this state will be updated if it was called outside of this hook
      updateLocalStateIfDifferent(newState);
    }

    // @ts-ignore
    const subscriberKey = state.sk;
    r[subscriberKey].push(stateChanged);
    return () => {
      // @ts-ignore
      r[subscriberKey] = r[subscriberKey].filter(
        (f: () => any) => f !== stateChanged
      );
    };
  });

  const setter = useCallback((newState: T) => {
    // change local state as fast as possible
    setLocalState(newState);
    state._set(newState);
  }, []);

  return [localState, setter];
}

export function getRidgeState<T>(state: StateWithValue<T>): T {
  return state.internal.value;
}

export function setRidgeState<T>(state: StateWithValue<T>, newState: T) {
  state._set(newState);
}
