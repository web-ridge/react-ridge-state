import { defaultState, newProductState } from "./ProductState";

test("Test if reset works", () => {
  const productState = newProductState();
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
