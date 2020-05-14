React Native (web) global state management which does not get in your way API influenced by Recoil from Facebook.

# Roadmap
- Publish to NPM (can anybody help?)

# Features
- Uses proxy
- React / React Native
- Simple
- Fast
- Very tiny



## Create state (sort of a store)
```typescript
import { newRidgeState } from 'react-ridge-state'
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
```typescript
import { getRidgeState } from 'react-ridge-state'
getRidgeState(cartProductsState)

```

## Set state outside of React
```typescript
import { getRidgeState } from 'react-ridge-state'
setRidgeState(cartProductsState)

```

