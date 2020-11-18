import { newRidgeState, computedRidgeState } from '../src';
const expectMocha = require('expect.js');

// https://stackoverflow.com/a/3959275/10039122
function factorial(num: number) {
  let result = num;
  if (num === 0 || num === 1) return 1;
  while (num > 1) {
    num--;
    result *= num;
  }
  return result;
}

const counterState = newRidgeState(0);
const factorialState = computedRidgeState(counterState, factorial);

it('Computed value has the correct value in Mocha', async () => {
  expectMocha(factorialState.get()).to.be(1);
  counterState.set(1);
  expectMocha(factorialState.get()).to.be(1);

  counterState.set(2);
  expectMocha(factorialState.get()).to.be(2);

  counterState.set(3);
  expectMocha(factorialState.get()).to.be(6);

  counterState.set(4);
  expectMocha(factorialState.get()).to.be(24);

  counterState.set(5);
  expectMocha(factorialState.get()).to.be(120);
});
