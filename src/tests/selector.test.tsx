import * as React from "react";
import { newRidgeState } from "../index";
import { render, waitFor } from "@testing-library/react";

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
  const imageVariation = deepState.useSelector(
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
