# react-ridge-state :weight_lifting_woman: ⚡️ :weight_lifting_man:

![Bundle Size](https://badgen.net/bundlephobia/minzip/react-ridge-state) [![npm version](https://badge.fury.io/js/react-ridge-state.svg)](https://badge.fury.io/js/react-ridge-state) ![npm](https://img.shields.io/npm/dt/react-ridge-state.svg)

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

// same interface and usage as setState
const [cartProducts, setCartProducts] = cartProductsState.use();

// if you only need the value and no setState
const cartProducts = cartProductsState.useValue();

// if you only want to subscribe to part of your state (this example the first product)
const cartProducts = cartProductsState.useSelector((state) => state[0]);

// custom comparison function (only use this if you have heavy child components and the default === comparison is not sufficient enough)
const cartProducts = cartProductsState.useSelector(
  (state) => state[0],
  (a, b) => JSON.stringify(a) === JSON.stringify(b)
);
```

### Outside of React

```typescript
import { cartProductsState } from "../cartProductsState";

// get the root state
cartProductsState.get();

// set the state directly
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

### Example

```tsx
// CartState.ts
import { newRidgeState } from "react-ridge-state";

// this can be used everywhere in your application
export const globalCounterState = newRidgeState<number>(0); // 0 could be something else like objects etc. you decide!

// Counter.tsx
function Counter() {
  // you can use these everywhere in your application the globalCounterState will update automatically  even if set globally
  const [count, setCount] = globalCounterState.use();
  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Add 1</button>
    </div>
  );
}

// CounterViewer.tsx
function CounterViewer() {
  // you can use these everywhere in your application the globalCounterState will update automatically even if set globally
  const counter = globalCounterState.useValue();

  return (
    <div>
      <div>Count: {counter}</div>
    </div>
  );
}
```

### Usage in class components

Since we want to keep this library small we are not supporting class components but you could use wrappers like this if you have class components, however we would recommend to use functional components since they are more type safe and easier to use.

```tsx

class YourComponentInternal extends Component {
  render() {
    <div>
      <div>Count: {this.props.count}</div>
      <button onClick={() => this.props.setCount(count + 1)}>Add 1</button>
    </div>
  }
}

export default function YourComponent(props) {
  const [count, setCount] = globalCounterState.use();
  return <YourComponentInternal {...props} count={count} setCount={setCount}>
}
```

### Persistence example

It's possible to add persistency to your state, you can use every library you want. localStorage is even simpler since you don't need async functions.

```typescript
const authStorageKey = "auth";
const authState = newRidgeState<AuthState>(
  { loading: true, token: "" },
  {
    onSet: async (newState) => {
      try {
        await AsyncStorage.setItem("@key", JSON.stringify(newState));
      } catch (e) {}
    },
  }
);

// setInitialState fetches data from localStorage
async function setInitialState() {
  try {
    const item = await AsyncStorage.getItem("@key");
    if (item) {
      const initialState = JSON.parse(item);
      authState.set(initialState);
    }
  } catch (e) {}
}

// run function as application starts
setInitialState();
```

## About us

We want developers to be able to build software faster using modern tools like GraphQL, Golang, React Native without depending on commercial providers like Firebase or AWS Amplify.

Checkout our other products too! :ok_hand: https://github.com/web-ridge
