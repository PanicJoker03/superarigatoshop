import { createReducer, on } from '@ngrx/store';
import { CartState, initialCartState } from './cart.state';
import * as CartActions from './cart.actions';

export const cartReducer = createReducer(
  initialCartState,
  // Create Cart
  on(CartActions.createCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.createCartSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: null,
  })),
  on(CartActions.createCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Line
  on(CartActions.addLine, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.addLineSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: null,
  })),
  on(CartActions.addLineFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Line
  on(CartActions.updateLine, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.updateLineSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: null,
  })),
  on(CartActions.updateLineFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Remove Lines
  on(CartActions.removeLines, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.removeLinesSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: null,
  })),
  on(CartActions.removeLinesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Get Cart
  on(CartActions.getCart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CartActions.getCartSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: null,
  })),
  on(CartActions.getCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear Cart
  on(CartActions.clearCart, () => initialCartState)
);
