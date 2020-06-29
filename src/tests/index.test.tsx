import * as React from "react";
import { newRidgeState } from "../index";
import {
  act,
  getNodeText,
  fireEvent,
  render,
  waitFor,
  cleanup,
} from "@testing-library/react";

afterEach(cleanup);

// this can be used everywhere in your application
const globalCounterState = newRidgeState<number>(0, {
  onSet: async (newState) => {
    try {
      localStorage.setItem("@key", JSON.stringify(newState));
    } catch (e) {}
  },
});

function CounterComponent() {
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
function CounterViewer() {
  const counter = globalCounterState.useValue();

  return <p data-testid={"cv2"}>{counter}</p>;
}

test("Both counters and global state change after click and global +", async () => {
  // test react hooks
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

  await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(1));
  await waitFor(() => expect(getCounterValueFromDiv("cv2")).toBe(1));

  // test global state set with previous callback
  act(() => {
    globalCounterState.set((prev) => prev + 1);
  });

  await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(2));
  await waitFor(() => expect(getCounterValueFromDiv("cv2")).toBe(2));

  // test global get/set
  const currentGlobalValue = globalCounterState.get();
  act(() => {
    globalCounterState.set(currentGlobalValue + 1);
  });
  await waitFor(() => expect(getCounterValueFromDiv("cv1")).toBe(3));
  await waitFor(() => expect(getCounterValueFromDiv("cv2")).toBe(3));
});

interface DeepImage {
  url: string;
}

interface DeepMedia {
  name: string;
  imageVariations: DeepImage[];
}

interface DeepProduct {
  name: string;
  price: number;
  media: DeepMedia[];
}

interface DeepState {
  cart: {
    products: DeepProduct[];
    total: number;
  };
}

const deepState = newRidgeState<DeepState>({
  cart: {
    products: [
      {
        name: "Nice product",
        price: 100,
        media: [
          {
            name: "Logo",
            imageVariations: [
              {
                url: "https://webridge.nl/img/black-logo.png",
              },
            ],
          },
        ],
      },
    ],
    total: 100,
  },
});

let deepMediaRenders = 0;
function DeepMedia() {
  deepMediaRenders++;
  const imageVariation = deepState.useSelect(
    (state) => state.cart.products[0].media[0].imageVariations[0]
  );
  return <img data-testid={"image"} src={imageVariation.url} />;
}

test("Select should not re-render when not changed", async () => {
  // test react hooks
  const deepMedia = render(<DeepMedia />);

  // test if render count = 1
  await waitFor(() => deepMediaRenders === 1);

  // should not render if media itself has not changed
  deepState.set((prev) => ({
    ...prev,
    cart: {
      ...prev.cart,
      products: prev.cart.products.map((p) => ({
        ...p,
        name: "NiceProductName",
      })),
    },
  }));

  // should not have re-rendered since equal has not changed
  await waitFor(() => deepMediaRenders === 1);
  await waitFor(() =>
    expect(deepMedia.queryByTestId("image")).toHaveProperty(
      "src",
      "https://webridge.nl/img/black-logo.png"
    )
  );

  // should  render if media itself has changed
  deepState.set((prev) => ({
    ...prev,
    cart: {
      ...prev.cart,
      products: prev.cart.products.map((p) => ({
        ...p,
        name: "NiceProductName",
        media: p.media.map((m) => ({
          ...m,
          imageVariations: m.imageVariations.map((iv) => ({
            ...iv,
            url: "https://webridge.nl/favicon.png",
          })),
        })),
      })),
    },
  }));

  // test if not called many times
  await waitFor(() => deepMediaRenders === 2);

  await waitFor(() =>
    expect(deepMedia.queryByTestId("image")).toHaveProperty(
      "src",
      "https://webridge.nl/favicon.png"
    )
  );
});

test("Test if unscribe works", async () => {
  globalCounterState.set(0);
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
