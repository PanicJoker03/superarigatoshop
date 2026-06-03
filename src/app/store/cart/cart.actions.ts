import { createAction, props } from '@ngrx/store';
import { Cart } from '../../commerce/cart-service';

// Create Cart
export const createCart = createAction(
  '[Cart] Create Cart',
  props<{ variantId: string; quantity?: number }>()
);

export const createCartSuccess = createAction(
  '[Cart] Create Cart Success',
  props<{ cart: Cart }>()
);

export const createCartFailure = createAction(
  '[Cart] Create Cart Failure',
  props<{ error: string }>()
);

// Add Line
export const addLine = createAction(
  '[Cart] Add Line',
  props<{ cartId: string; variantId: string; quantity?: number }>()
);

export const addLineSuccess = createAction(
  '[Cart] Add Line Success',
  props<{ cart: Cart }>()
);

export const addLineFailure = createAction(
  '[Cart] Add Line Failure',
  props<{ error: string }>()
);

// Update Line
export const updateLine = createAction(
  '[Cart] Update Line',
  props<{ cartId: string; lineId: string; quantity: number }>()
);

export const updateLineSuccess = createAction(
  '[Cart] Update Line Success',
  props<{ cart: Cart }>()
);

export const updateLineFailure = createAction(
  '[Cart] Update Line Failure',
  props<{ error: string }>()
);

// Remove Lines
export const removeLines = createAction(
  '[Cart] Remove Lines',
  props<{ cartId: string; lineIds: string[] }>()
);

export const removeLinesSuccess = createAction(
  '[Cart] Remove Lines Success',
  props<{ cart: Cart }>()
);

export const removeLinesFailure = createAction(
  '[Cart] Remove Lines Failure',
  props<{ error: string }>()
);

// Get Cart
export const getCart = createAction(
  '[Cart] Get Cart',
  props<{ cartId: string }>()
);

export const getCartSuccess = createAction(
  '[Cart] Get Cart Success',
  props<{ cart: Cart }>()
);

export const getCartFailure = createAction(
  '[Cart] Get Cart Failure',
  props<{ error: string }>()
);

// Clear Cart
export const clearCart = createAction('[Cart] Clear Cart');
