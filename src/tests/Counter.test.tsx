import {
  act,
  fireEvent,
  getNodeText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { CounterComponent, CounterViewer } from "./Counter";
import * as React from "react";
import { globalCounterState } from "./CounterState";

test("Both counters and global state change after click and global +", async () => {
  act(() => {
    render(
      <>
        <CounterComponent />
        <CounterViewer />)
      </>
    );
  });

  act(() => {
    fireEvent.click(screen.queryByTestId("counterButton"));
  });

  const getCounterValueFromDiv = (testId: string): number => {
    return Number(getNodeText(screen.queryByTestId(testId)));
  };

  await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(1));
  await waitFor(() => expect(getCounterValueFromDiv("cv2")).toBe(1));

  // test global state set with previous callback
  const randomTime = getRndInteger(1, 2000);
  // console.log({ randomTime });
  setTimeout(async () => {
    globalCounterState.set((prev) => prev + 1);
    await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(2));
    await waitFor(() => expect(getCounterValueFromDiv("cv2")).toBe(2));

    // test global get/set
    const currentGlobalValue = globalCounterState.get();
    globalCounterState.set(currentGlobalValue + 1);

    await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(3));
    await waitFor(() => expect(getCounterValueFromDiv("cv2")).toBe(3));
  }, randomTime);
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
