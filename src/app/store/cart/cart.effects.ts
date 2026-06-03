import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CartService } from '../../commerce/cart-service';
import * as CartActions from './cart.actions';

@Injectable()
export class CartEffects {
    actions$ = inject(Actions);
    cartService = inject(CartService);
//   constructor(private actions$: Actions, private ) {}

  createCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.createCart),
      switchMap(({ variantId, quantity }) =>
        this.cartService.createCart(variantId, quantity).pipe(
          tap((cart) => {
            // Store cart ID in localStorage for persistence
            if (cart.id) {
              localStorage.setItem('cartId', cart.id);
            }
          }),
          map((cart) => CartActions.createCartSuccess({ cart })),
          catchError((error) =>
            of(CartActions.createCartFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addLine),
      switchMap(({ cartId, variantId, quantity }) =>
        this.cartService.addLine(cartId, variantId, quantity).pipe(
          map((cart) => CartActions.addLineSuccess({ cart })),
          catchError((error) =>
            of(CartActions.addLineFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateLine),
      switchMap(({ cartId, lineId, quantity }) =>
        this.cartService.updateLine(cartId, lineId, quantity).pipe(
          map((cart) => CartActions.updateLineSuccess({ cart })),
          catchError((error) =>
            of(CartActions.updateLineFailure({ error: error.message }))
          )
        )
      )
    )
  );

  removeLines$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeLines),
      switchMap(({ cartId, lineIds }) =>
        this.cartService.removeLines(cartId, lineIds).pipe(
          map((cart) => CartActions.removeLinesSuccess({ cart })),
          catchError((error) =>
            of(CartActions.removeLinesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  //dangerous, fail sometimes
  getCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.getCart),
      switchMap(({ cartId }) =>
        this.cartService.getCart(cartId).pipe(
          map((cart) => CartActions.getCartSuccess({ cart })),
          catchError((error) =>
            of(CartActions.getCartFailure({ error: error.message }))
          )
        )
      )
    )
  );

  clearCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.clearCart),
        tap(() => {
          // Remove cart ID from localStorage
          localStorage.removeItem('cartId');
        })
      ),
    { dispatch: false }
  );

}
