// This file was copied with
// for i in {1..300}; do cp StateRacing.test.tsx "StateRacing_$i.test.tsx" ; done
// to test if global state is shared between Jest files

import { globalCounterState } from "./CounterState";

test("Test if global state is not shared between files in Jest", async () => {
  await sleeper(getRndInteger(1, 10));
  expect(globalCounterState.get()).toBe(0);
  globalCounterState.set((prev) => prev + 1);
  await sleeper(getRndInteger(1, 10));
  expect(globalCounterState.get()).toBe(1);
  globalCounterState.set((prev) => prev + 1);
  await sleeper(getRndInteger(1, 10));
  expect(globalCounterState.get()).toBe(2);
  globalCounterState.set((prev) => prev + 1);
  await sleeper(getRndInteger(1, 10));
  expect(globalCounterState.get()).toBe(3);
  globalCounterState.set((prev) => prev + 1);
  await sleeper(getRndInteger(1, 10));
  expect(globalCounterState.get()).toBe(4);
  globalCounterState.set((prev) => prev + 1);
  expect(globalCounterState.get()).toBe(5);
});
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function sleeper(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}
