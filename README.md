# react-ridge-state :weight_lifting_woman: ⚡️ :weight_lifting_man:

![Bundle Size](https://badgen.net/bundlephobia/minzip/react-ridge-state) [![npm version](https://badge.fury.io/js/react-ridge-state.svg)](https://badge.fury.io/js/react-ridge-state) ![npm](https://img.shields.io/npm/dt/react-ridge-state.svg)

**Simple** :muscle: **fast** ⚡️ and **small** :balloon: (400 bytes) global state management for React which can be used outside of a React component too!

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
- Very tiny (400 bytes)
- 100% Typesafe
- Hooks
- Use outside React components
- Custom selectors for deep state selecting

## About us
We want developers to be able to build software faster using modern tools like GraphQL, Golang and React Native.

Give us a follow on Twitter:
[RichardLindhout](https://twitter.com/RichardLindhout),
[web_ridge](https://twitter.com/web_ridge)

## Donate
Please contribute or donate so we can spend more time on this library

[Donate with PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7B9KKQLXTEW9Q&source=url)


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
import { cartProductsState } from "../cartProductsState";

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

### Supported functions outside of React
The following functions work outside of React e.g. in your middleware but you can also use them in your component.

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

// you can reset to initial state too
cartProductsState.reset()

// you can also subscribe to state changes outside React

const unsubscribe = cartProductsState.subscribe((newState, oldState) => {
  console.log("State changed");
});

// call the returned unsubscribe function to unsubscribe.
unsubscribe();
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

It's possible to add make your state persistent, you can use storage library you desire. 
localStorage is even simpler since you don't need async functions

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

### Managing complex/nested state with Immer

Sometimes you might need to update values that are deeply nested, code for this can end up looking verbose as you will likely need to use many spread operators. A small utility library called [Immer](https://github.com/immerjs/immer) can help simplify things.

```tsx
const characterState = newRidgeState<CharacterState>({
  gold: 100,
  stats: {
    spells: {
      fire: 10,
      watter: 10
    },
    battle: {
      health: 100,
      mana: 100
    },
    profession: {
      mining: 10,
      herbalism: 10
    }
  }
})

// Update mana and herbalism without immer
characterState.set(previous => ({
  ...previous,
  stats: {
    ...previous.stats,
    battle: {
      ...previous.stats.battle,
      mana: 200
    },
    profession: {
      ...previous.stats.profession,
      herbalism: 20
    }
  }
}))

// Update mana and herbalism using immer
import { produce } from "immer";

characterState.set(previous =>
  produce(previous, updated => {
    updated.stats.battle.mana = 200
    updated.stats.profession.herbalism = 20
  })
)
```


## Testing your components which use react-ridge-state

You can find examples of testing components with global state here:
https://github.com/web-ridge/react-ridge-state/blob/main/src/tests/Counter.test.tsx

### Jest
Jest keeps the global state between tests in one file. 
Tests inside one file run synchronous by default, so no racing can occur. 
   
When testing in different files (test1.test.js, test2.test.js), the global state is new for every file. 
You don't have to mock or reset the state even if the tests run in parallel.

### Mocha

In Mocha you will need to reset the state the initial value before each test since the state is shared across all tests.
You could do that with the code below and **not** using the --parallel mode of Mocha.

```tsx
beforeEach(()=> {
    characterState.reset()
})
```

### Checkout our other libraries
- Simple form library for React Native with great UX for developer and end-user [react-native-use-form](https://github.com/web-ridge/react-native-use-form)
- Smooth and fast cross platform Material Design date and time picker for React Native Paper: [react-native-paper-dates](https://github.com/web-ridge/react-native-paper-dates)
- Smooth and fast cross platform Material Design Tabs for React Native Paper: [react-native-paper-tabs](https://github.com/web-ridge/react-native-paper-tabs)
- Simple translations in React (Native): [react-ridge-translations](https://github.com/web-ridge/react-ridge-translations)
- 1 command utility for React Native (Web) project: [create-react-native-web-application](https://github.com/web-ridge/create-react-native-web-application)


