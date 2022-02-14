import { newProductState } from "./ProductState";
import { waitFor } from "@testing-library/react";

test("Test if subscribe works", async () => {
  const productState = newProductState();
  const subscriber = jest.fn();
  const unsub = productState.subscribe(subscriber);
  productState.set({
    id: "2",
    name: "Test2",
  });
  await waitFor(() => expect(subscriber).toHaveBeenCalledTimes(1));
  unsub();
  let done = false;
  productState.set(
    {
      id: "3",
      name: "Test3",
    },
    () => {
      // this callback is called after subscribers
      expect(subscriber).toHaveBeenCalledTimes(1);
      done = true;
    }
  );
  await waitFor(() => done);
});
