Very simple global state management which does not get in your way.

# Roadmap

- Publish to NPM

# Features

- Uses Proxy


1. Create a file e.g. CartState.tsx
2. Import 
```typescript
import { newRidgeState } from 'react-ridge-state'
```
## Create state (sort of a store)
```typescript
interface CartProduct {
  id: number
  name: string
}
const defaultState: CartProduct[] = [{id:1, name:'Product'}]
export const cartProductsState = newRidgeState<CartProduct[]>({
  key: 'CartState',
  defaultState,
})
```

## Use state inside components
```typescript
import { useRidgeState } from 'react-ridge-state'

const [cartProduct, setCartProduct] = useGlobalState(cartProductsState)


```

## Use state outside of React
```
import { getRidgeState } from 'react-ridge-state'
getRidgeState(cartProductsState)

```

## Set state outside of React
```
import { getRidgeState } from 'react-ridge-state'
setRidgeState(cartProductsState)

```

