import {
  act,
  fireEvent,
  getNodeText,
  render,
  waitFor,
} from "@testing-library/react";
import { CounterComponent, CounterViewer } from "./Counter";
import * as React from "react";

test("Both counters and global state change after click and global +", async () => {
  const counters = render(
    <>
      <CounterComponent />
      <CounterViewer />)
    </>
  );

  act(() => {
    fireEvent.click(counters.queryByTestId("counterButton"));
  });

  const getCounterValueFromDiv = (testId: string): number => {
    return Number(getNodeText(counters.queryByTestId(testId)));
  };

  await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(1));
  await waitFor(() => expect(getCounterValueFromDiv("cv2")).toBe(1));

  // test global state set with previous callback
  const randomTime = getRndInteger(500, 2000);
  await sleeper(randomTime);

  act(() => {
    fireEvent.click(counters.queryByTestId("counterButton"));
  });

  await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(2));
  await waitFor(() => expect(getCounterValueFromDiv("cv2")).toBe(2));

  // test global get/set
  act(() => {
    fireEvent.click(counters.queryByTestId("counterButton"));
  });

  await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(3));
  await waitFor(() => expect(getCounterValueFromDiv("cv2")).toBe(3));
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function sleeper(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}
