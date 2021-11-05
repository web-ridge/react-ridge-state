import { newRidgeState } from "../src";

interface Product {
  id: string;
  name: string;
}

const defaultState = {
  id: "1",
  name: "Test",
};
const productState = newRidgeState<Product>(defaultState);

test("Test if reset works", () => {
  const newState = {
    id: "2",
    name: "Test2",
  };
  productState.set(newState);

  expect(productState.get()).not.toBe(defaultState);
  expect(productState.get()).toBe(newState);
  productState.reset();
  expect(productState.get()).toBe(defaultState);
});
