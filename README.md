# react-ridge-state :weight_lifting_woman: ⚡️ :weight_lifting_man:

**Simple** :muscle: **fast** ⚡️ and **small** :balloon: (500 bytes) global state management for React which can be used outside of a React component too!

```
yarn add react-ridge-state
```

or

```
npm install react-ridge-state --save
```

## Why another state library :thinking:

We were frustrated that the current solutions could often only be used from React or have too complicated APIs. We wanted a lightweight solution with a smart API that can also be used outside React components.

## Features :woman_juggling:

- React / React Native
- Simple
- Fast
- Very tiny (500 bytes)
- 100% Typesafe
- Hooks
- Use outside React components

## Roadmap :running_woman: :running_man:

- Persistent (probably another libary)
- Custom selectors
- Even simpler api without needing to import anything from react-ridge-state (coming in v4)

## Getting started :clap: :ok_hand:

### Create a new state

```typescript
import { newRidgeState } from "react-ridge-state";
interface CartProduct {
  id: number;
  name: string;
}
export const cartProductsState = newRidgeState<CartProduct[]>([
  { id: 1, name: "Product" },
]);
```

### Use state inside components

```typescript
import { useRidgeState } from "react-ridge-state";

const [cartProducts, setCartProducts] = useRidgeState(cartProductsState);
```

### Use state outside of React

```typescript
import { getRidgeState } from "react-ridge-state";
getRidgeState(cartProductsState);
```

### Set state outside of React

```typescript
import { setRidgeState } from "react-ridge-state";
setRidgeState(cartProductsState, [{ id: 1, name: "NiceProduct" }]);
```

## About us
We want developers to be able to build software faster using modern tools like GraphQL, Golang, React Native without depending on commercial providers like Firebase or AWS Amplify.

Checkout our other products too! :ok_hand: https://github.com/web-ridge
