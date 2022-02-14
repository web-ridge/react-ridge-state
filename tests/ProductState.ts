import { newRidgeState } from "../src";

export interface Product {
  id: string;
  name: string;
}

export const defaultState = {
  id: "1",
  name: "Test",
};

export function newProductState() {
  return newRidgeState<Product>(defaultState);
}
