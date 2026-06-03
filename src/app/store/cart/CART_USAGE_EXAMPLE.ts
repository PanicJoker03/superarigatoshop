// // LCNG : LEECH FROM HERE
// /**
//  * USAGE EXAMPLE: How to use CartFacade in components
//  *
//  * The CartFacade provides a unified interface that handles both the CartService
//  * and NgRx Store. Components should ALWAYS use CartFacade instead of directly
//  * accessing CartService or Store.
//  *
//  * This example shows best practices for using the facade in Angular components.
//  */

// import { Component, inject, OnInit } from '@angular/core';
// import { CartFacade } from './cart.facade';

// @Component({
//   selector: 'app-cart-example',
//   template: `
//     <div>
//       <!-- Subscribe to cart state using async pipe -->
//       <div *ngIf="cartLoading$ | async">Loading cart...</div>

//       <div *ngIf="cartError$ | async as error" class="error">
//         {{ error }}
//       </div>

//       <!-- Display cart lines -->
//       <div *ngFor="let line of (cartLines$ | async)">
//         <h3>{{ line.title }}</h3>
//         <p>Quantity: {{ line.quantity }}</p>
//         <p>Price: {{ line.price }}</p>
//         <button (click)="removeItem(line.id)">Remove</button>
//       </div>

//       <!-- Display totals -->
//       <p>Total Items: {{ (cartTotalQuantity$ | async) || 0 }}</p>

//       <!-- Checkout link -->
//       <a *ngIf="cartCheckoutUrl$ | async as url" [href]="url" target="_blank">
//         Proceed to Checkout
//       </a>
//     </div>
//   `,
// })
// export class CartExampleComponent implements OnInit {
//   // Inject the facade
//   public cartFacade = inject(CartFacade)
// //   constructor(public cartFacade: CartFacade) {}

//   ngOnInit() {
//     // Load existing cart if you have cartId
//     const cartId = this.getCartIdFromStorage();
//     if (cartId) {
//       this.cartFacade.loadCart(cartId);
//     }
//   }

//   // Expose observables from facade to template
//   cart$ = this.cartFacade.cart$;
//   cartLoading$ = this.cartFacade.cartLoading$;
//   cartError$ = this.cartFacade.cartError$;
//   cartLines$ = this.cartFacade.cartLines$;
//   cartTotalQuantity$ = this.cartFacade.cartTotalQuantity$;
//   cartCheckoutUrl$ = this.cartFacade.cartCheckoutUrl$;

//   /**
//    * CREATE CART
//    * Dispatches action to create new cart with a product
//    * The facade handles:
//    * - Calling CartService.createCart()
//    * - Dispatching cart.actions.createCart()
//    * - Managing loading/error states
//    * - Storing result in cart state
//    */
//   createNewCart(variantId: string): void {
//     this.cartFacade.createCart(variantId, 1);
//     // Component doesn't need to know HOW it happens, just call it
//   }

//   /**
//    * ADD ITEM
//    * Dispatches action to add product to existing cart
//    */
//   addItemToCart(variantId: string): void {
//     const cartId = this.cartFacade.cart$
//       .subscribe((cart) => {
//         if (cart?.id) {
//           this.cartFacade.addLineToCart(cart.id, variantId, 1);
//         }
//       })
//       .unsubscribe();
//   }

//   /**
//    * UPDATE QUANTITY
//    * Dispatches action to update line quantity
//    */
//   updateQuantity(lineId: string, newQuantity: number): void {
//     this.cartFacade.cart$.subscribe((cart) => {
//       if (cart?.id) {
//         this.cartFacade.updateLineQuantity(cart.id, lineId, newQuantity);
//       }
//     });
//   }

//   /**
//    * REMOVE ITEM
//    * Dispatches action to remove item(s) from cart
//    */
//   removeItem(lineId: string): void {
//     this.cartFacade.cart$.subscribe((cart) => {
//       if (cart?.id) {
//         this.cartFacade.removeFromCart(cart.id, [lineId]);
//       }
//     });
//   }

//   /**
//    * CLEAR CART
//    * Resets cart state
//    */
//   clearCart(): void {
//     this.cartFacade.clearCart();
//   }

//   private getCartIdFromStorage(): string | null {
//     // Example: retrieve from localStorage
//     return localStorage.getItem('cartId');
//   }
// }

// /**
//  * FLOW DIAGRAM:
//  *
//  * Component calls CartFacade method
//  *     ↓
//  * CartFacade.dispatch(Action)
//  *     ↓
//  * CartEffects listens for action
//  *     ↓
//  * CartEffects calls CartService
//  *     ↓
//  * CartService makes API call to Shopify
//  *     ↓
//  * CartEffects dispatches Success/Failure action
//  *     ↓
//  * CartReducer updates store state
//  *     ↓
//  * Selectors provide updated state to component
//  *     ↓
//  * Component re-renders with new data (via async pipe)
//  *
//  * BENEFITS:
//  * ✓ Components are decoupled from store/service implementation details
//  * ✓ All cart state is centralized in NgRx
//  * ✓ Easier testing (mock CartFacade)
//  * ✓ Consistent cart state across entire app
//  * ✓ Easy to add logging/analytics middleware
//  */
