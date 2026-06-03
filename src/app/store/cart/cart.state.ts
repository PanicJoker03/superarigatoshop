import { CartLine, Cart } from '../../commerce/cart-service';

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  cart: null,
  loading: false,
  error: null,
};
