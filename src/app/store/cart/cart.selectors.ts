import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';
import { Cart } from '../../commerce/cart-service';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCart = createSelector(
  selectCartState,
  (state: CartState) => state.cart
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state: CartState) => state.loading
);

export const selectCartError = createSelector(
  selectCartState,
  (state: CartState) => state.error
);

export const selectCartLines = createSelector(
  selectCart,
  (cart: Cart | null) => cart?.lines || []
);

export const selectCartTotalQuantity = createSelector(
  selectCart,
  (cart: Cart | null) => cart?.totalQuantity || 0
);

export const selectCartCheckoutUrl = createSelector(
  selectCart,
  (cart: Cart | null) => cart?.checkoutUrl || ''
);
