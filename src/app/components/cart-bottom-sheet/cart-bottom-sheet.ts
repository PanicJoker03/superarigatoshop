import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { CartLine } from '../../commerce/cart-service';
import { CartFacade } from '../../store/cart';

@Component({
  selector: 'app-cart-bottom-sheet',
  imports: [CurrencyPipe, MatBottomSheetModule, MatButtonModule, MatCardModule, MatListModule],
  templateUrl: './cart-bottom-sheet.html',
  styleUrl: './cart-bottom-sheet.scss',
})
export class CartBottomSheet {
  private readonly cart = inject(CartFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly bottomSheetRef = inject(MatBottomSheetRef<CartBottomSheet>);
  private readonly router = inject(Router);

  readonly cartLines = signal<CartLine[]>([]);
  readonly loading = signal(false);
  readonly subtotal = computed(() => this.cartLines().reduce((sum, line) => sum + line.subtotal, 0));

  constructor() {
    this.cart.cart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((cart) => {
      if (cart) {
        this.cartLines.set(cart.lines);
        this.loading.set(false);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        this.loading.set(true);
        this.cart.loadCart(cartId);
      }
    }
  }

  continueShopping(): void {
    this.bottomSheetRef.dismiss();
  }

  continueToPayment(): void {
    this.bottomSheetRef.dismiss();
    void this.router.navigate(['/pages/payment']);
  }
}
