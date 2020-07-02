import { newRidgeState } from "../index";

export const globalCounterState = newRidgeState<number>(0, {
  onSet: async (newState) => {
    try {
      localStorage.setItem("@key", JSON.stringify(newState));
    } catch (e) {}
  },
});
