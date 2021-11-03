/**
 * @jest-environment jsdom
 */
import {
  act,
  fireEvent,
  getNodeText,
  render,
  waitFor,
} from "@testing-library/react";
import { CounterComponent, CounterViewer } from "./Counter";
import * as React from "react";
import { globalCounterState } from "./CounterState";

test("Test if unsubscribe works", async () => {
  // test react hooks
  const counter = render(<CounterComponent />);
  const counter2 = render(<CounterViewer />);

  act(() => {
    fireEvent.click(counter.queryByTestId("counterButton"));
  });

  const getCounterValueFromDiv = (testId: string): number => {
    return Number(getNodeText(counter.queryByTestId(testId)));
  };

  await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(1));
  await waitFor(() => expect(getCounterValueFromDiv("cv2")).toBe(1));

  // test global state set with previous callback
  act(() => {
    globalCounterState.set((prev) => prev + 1);
  });

  counter2.unmount();

  await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(2));

  // test global get/set
  const currentGlobalValue = globalCounterState.get();
  act(() => {
    globalCounterState.set(currentGlobalValue + 1);
  });
  await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(3));

  // test if state is saved in persistent state
  await waitFor(() => expect(JSON.parse(localStorage.getItem("@key"))).toBe(3));
});
