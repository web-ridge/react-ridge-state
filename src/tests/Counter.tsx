// this can be used everywhere in your application

import * as React from "react";
import { globalCounterState } from "./CounterState";

export function CounterComponent() {
  const [count, setCount] = globalCounterState.use();
  return (
    <>
      <p data-testid={"cv1"}>{count}</p>
      <button
        onClick={() => setCount((prev) => prev + 1)}
        data-testid={"counterButton"}
      >
        +1
      </button>
    </>
  );
}

// you can use these everywhere in your application the globalCounterState will update automatically
// even if set globally
export function CounterViewer() {
  const counter = globalCounterState.useValue();

  return <p data-testid={"cv2"}>{counter}</p>;
}
