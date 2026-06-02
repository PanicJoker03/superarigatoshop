import { Component, inject, signal } from '@angular/core';
import { Product } from '../../components/product-grid-item/product.model';
import { ShopifyService } from '../../commerce/shopify-service';
import { CartService } from '../../commerce/cart-service';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-payment',
  imports: [MatCard, MatCardHeader, MatCardModule, MatButtonToggle, MatButtonToggleGroup, MatButtonModule, MatListModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment {
  router = inject(Router);
  cartService = inject(CartService)
  cartLines = ['Mouse Pad Mario', 'Mouse Pad Princesa', 'Tasa Bowser']
  pay(){
    //todo: create cart to test checkoutUrlrrl
    //this.cartService
  }  
}
