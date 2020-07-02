// This file was copied with
// for i in {1..300}; do cp StateRacing.mocha.tsx "StateRacing_$i.mocha.tsx" ; done
// to test if global state is shared between Jest files

import { globalCounterState } from "./CounterState";
const expectMocha = require("expect.js");

it("Test if global state is not shared between files in Mocha", async () => {
  await sleeper(getRndInteger(1, 10));
  expectMocha(globalCounterState.get()).to.be(0);
  globalCounterState.set((prev) => prev + 1);
  await sleeper(getRndInteger(1, 10));
  expectMocha(globalCounterState.get()).to.be(1);
  globalCounterState.set((prev) => prev + 1);
  await sleeper(getRndInteger(1, 10));
  expectMocha(globalCounterState.get()).to.be(2);
  globalCounterState.set((prev) => prev + 1);
  await sleeper(getRndInteger(1, 10));
  expectMocha(globalCounterState.get()).to.be(3);
  globalCounterState.set((prev) => prev + 1);
  await sleeper(getRndInteger(1, 10));
  expectMocha(globalCounterState.get()).to.be(4);
  globalCounterState.set((prev) => prev + 1);
  expectMocha(globalCounterState.get()).to.be(5);
});
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function sleeper(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}
