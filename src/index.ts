import { useEffect, useState, useCallback } from "react";

// global reference to store things in React (Native)
// @ts-ignore
const root: any = window || global;

interface StateWithValue<T> {
  value: T;
}

export function newRidgeState<T>({
  key,
  defaultState,
}: {
  key: string;
  defaultState: T;
}): StateWithValue<T> {
  const subscriberKey = `wr_subscribers_${key}`;

  root[subscriberKey] = [];

  const proxy = new Proxy(
    { value: defaultState },
    {
      getOwnPropertyDescriptor(target: any, prop: any) {
        if (prop === "subscriberKey") {
          return { configurable: true, enumerable: true, value: subscriberKey };
        }
        return undefined;
      },
      set(state: StateWithValue<T>, _: string, newState: T) {
        // This is a proxy hook
        // We only want to change value so we ignore the key here
        state.value = newState;

        // let subscribers know value did change
        root[subscriberKey].forEach((callback: any) => callback(newState));
        return true;
      },
    }
  );

  return proxy as any;
}

export function useRidgeState<T>(state: {
  value: T;
}): [T, (newState: T) => any] {
  const [localState, setLocalState] = useState<T>(state.value);

  const updateLocalStateIfDifferent = useCallback(
    (newState) => {
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
    const subscriberKey = Object.getOwnPropertyDescriptor(
      state,
      "subscriberKey"
    ).value;

    // @ts-ignore
    window[subscriberKey].push(stateChanged);
    return () => {
      // @ts-ignore
      window[subscriberKey] = window[subscriberKey].filter(
        (f: () => any) => f !== stateChanged
      );
    };
  });

  const setter = useCallback(
    (newState: T) => {
      // change local state as fast as possible
      setLocalState(newState);

      // update proxy value
      // the proxy will let subscribers know it has changed
      state.value = newState;
    },
    [state.value]
  );

  return [localState, setter];
}

export function getRidgeState<T>(state: StateWithValue<T>): T {
  return state.value;
}

export function setRidgeState<T>(state: StateWithValue<T>, newState: T) {
  state.value = newState;
}
