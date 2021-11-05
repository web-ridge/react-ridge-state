import { newRidgeState } from "../src";

export const globalCounterState = newRidgeState<number>(0, {
  onSet: (newState) => {
    try {
      localStorage.setItem("@key", JSON.stringify(newState));
    } catch (e) {}
  },
});
