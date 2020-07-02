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

const expectMocha = require("expect.js");
require("jsdom-global")();

//https://github.com/testing-library/react-testing-library/issues/141
// const dom = new jsdom.JSDOM("<!doctype html><html><body></body></html>");
//
// global.window = dom.window;
// global.document = dom.window.document;
// global.navigator = dom.window.navigator;
//
// // new lines
// global.Node = dom.window.Node;
// require("mutationobserver-shim");
// global.MutationObserver = global.window.MutationObserver;

it("Both counters and global state change after click and global +", async () => {
  const counter = render(
    <>
      <CounterComponent />
      <CounterViewer />)
    </>
  );

  act(() => {
    fireEvent.click(counter.queryByTestId("counterButton"));
  });

  const getCounterValueFromDiv = (testId: string): number => {
    return Number(getNodeText(counter.queryByTestId(testId)));
  };

  await waitFor(() => expectMocha(getCounterValueFromDiv("cv1")).to.be(1));
  await waitFor(() => expectMocha(getCounterValueFromDiv("cv2")).to.be(1));

  // test global state set with previous callback
  act(() => {
    globalCounterState.set((prev) => prev + 1);
  });

  await waitFor(() => expectMocha(getCounterValueFromDiv("cv1")).to.be(2));
  await waitFor(() => expectMocha(getCounterValueFromDiv("cv2")).to.be(2));

  // test global get/set
  const currentGlobalValue = globalCounterState.get();
  act(() => {
    globalCounterState.set(currentGlobalValue + 1);
  });
  await waitFor(() => expectMocha(getCounterValueFromDiv("cv1")).to.be(3));
  await waitFor(() => expectMocha(getCounterValueFromDiv("cv2")).to.be(3));
});
