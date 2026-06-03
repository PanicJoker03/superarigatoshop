import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Cart, CartLine, CartService } from '../../commerce/cart-service';
import * as CartActions from './cart.actions';
import * as CartSelectors from './cart.selectors';

/**
 * CartFacade provides a unified interface for components to interact with cart operations.
 * It handles both store dispatching and CartService communication transparently.
 * Components should use this service instead of directly interacting with CartService or Store.
 */
@Injectable({
  providedIn: 'root',
})
export class CartFacade {
  // Observable selectors for components to subscribe to
  store = inject(Store);
  cartService = inject(CartService);
  cart$: Observable<Cart | null> = this.store.select(CartSelectors.selectCart);
  cartLoading$: Observable<boolean> = this.store.select(CartSelectors.selectCartLoading);
  cartError$: Observable<string | null> = this.store.select(CartSelectors.selectCartError);
  cartLines$: Observable<CartLine[]> = this.store.select(CartSelectors.selectCartLines);
  cartTotalQuantity$: Observable<number> = this.store.select(CartSelectors.selectCartTotalQuantity);
  cartCheckoutUrl$: Observable<string> = this.store.select(CartSelectors.selectCartCheckoutUrl);

  /**
   * Create a new cart with an initial product variant
   * @param variantId Product variant ID from Shopify
   * @param quantity Number of items (default: 1)
   */
  createCart(variantId: string, quantity: number = 1): void {
    //shopify create cart
    this.store.dispatch(CartActions.createCart({ variantId, quantity }));
  }

  /**
   * Add a product variant to existing cart
   * @param cartId Cart ID
   * @param variantId Product variant ID from Shopify
   * @param quantity Number of items (default: 1)
   */
  addLineToCart(cartId: string, variantId: string, quantity: number = 1): void {
    this.store.dispatch(CartActions.addLine({ cartId, variantId, quantity }));
  }

  /**
   * Update quantity of an existing cart line
   * @param cartId Cart ID
   * @param lineId Cart line ID
   * @param quantity New quantity
   */
  updateLineQuantity(cartId: string, lineId: string, quantity: number): void {
    this.store.dispatch(CartActions.updateLine({ cartId, lineId, quantity }));
  }

  /**
   * Remove one or more items from cart
   * @param cartId Cart ID
   * @param lineIds Array of cart line IDs to remove
   */
  removeFromCart(cartId: string, lineIds: string[]): void {
    this.store.dispatch(CartActions.removeLines({ cartId, lineIds }));
  }

  /**
   * Fetch and reload cart data
   * @param cartId Cart ID to fetch
   */
  loadCart(cartId: string, variantId:string, quantity: number): void {
    //validate cart if not exists create cart 
    this.store.dispatch(CartActions.getCart({ cartId }));
  }

  /**
   * Clear cart from store (local state reset)
   */
  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }

  private getCartIdFromStorage(): string | null {
    // Example: retrieve from localStorage
    return localStorage.getItem('cartId');
  }
  
  private setCartIdFromStorage(cartId:string): void  {
    // Example: retrieve from localStorage
    localStorage.getItem('cartId');
  }
}
