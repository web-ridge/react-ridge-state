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

- Custom selectors for deep state selecting

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
import { cartProductsState } from "../cartProductsStatee";

const [cartProducts, setCartProducts] = cartProductsState.use();
```

### Use state outside of React

```typescript
import { cartProductsState } from "../cartProductsStatee";
cartProductsState.get();
```

### Set state outside of React

```typescript
import { cartProductsState } from "../cartProductsStatee";

// simple and direct
cartProductsState.set([{ id: 1, name: "NiceProduct" }]);

// if you want previous state as callback
cartProductsState.set((prevState) => [
  ...prevState,
  { id: 1, name: "NiceProduct" },
]);

// you can also use a callback so you know when state has rendered
cartProductsState.set(
  (prevState) => [...prevState, { id: 1, name: "NiceProduct" }],
  (newState) => {
    console.log("New state is rendered everywhere");
  }
);
```

### Counter example

```tsx
import { newRidgeState } from "react-ridge-state";

// this can be used everywhere in your application
export const globalCounterState = newRidgeState<number>(0);

function CounterComponent() {
  const [count, setCount] = globalCounterState.use();
  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => setCount(c + 1)}>Add 1</button>
    </div>
  );
}

// you can use these everywhere in your application the globalCounterState will update automatically
// even if set globally
function CounterViewer() {
  const [c, sc] = globalCounterState.useValue();

  return (
    <div>
      <div>Count: {c}</div>
    </div>
  );
}
```

### Persistence example

It's possible to add persistency to your state. (add try/catch if you use localStorage in real app)

```typescript
const authStorageKey = "auth";
const authState = newRidgeState<AuthState>(
  getInitialState() || emptyAuthState,
  { onSet }
);

// getInitialState fetches data from localStorage
function getInitialState() {
  let initialState = undefined;
  const item = localStorage.getItem(authStorageKey);
  if (item) {
    initialState = JSON.parse(item);
  }
}

// onSet is called after state has been set
function onSet() {
  // save to local storage
  localStorage.setItem(authStorageKey, JSON.stringify(newState));
}
```

## About us

We want developers to be able to build software faster using modern tools like GraphQL, Golang, React Native without depending on commercial providers like Firebase or AWS Amplify.

Checkout our other products too! :ok_hand: https://github.com/web-ridge
