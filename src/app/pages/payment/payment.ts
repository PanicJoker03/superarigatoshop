import { afterNextRender, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Product } from '../../components/product-grid-item/product.model';
import { ShopifyService } from '../../commerce/shopify-service';
import { CartFacade } from '../../store/cart';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import { filter, take } from 'rxjs';
import { CartLine } from '../../commerce/cart-service';
import { isPlatformBrowser } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports: [MatCard, MatCardHeader, MatCardModule, MatButtonToggle, MatButtonToggleGroup, MatButtonModule, MatListModule, CurrencyPipe],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment {
  cartId = "";
  router = inject(Router);
  cart = inject(CartFacade)
  cartLines = signal<CartLine[]>([])
  subtotal = computed(() => this.cartLines().reduce((sum, line) => sum + line.subtotal, 0).toFixed(2));
  plaftormId = inject(PLATFORM_ID)

  constructor(){
    afterNextRender(() => {
    this.cartId = localStorage.getItem('cartId') ?? '';
    console.log("stored cartId:", this.cartId);
  });
  }

  ngAfterViewInit(){  
    this.cart.loadCart(this.cartId);
    this.cart.cart$.pipe(
      filter(cart => !!cart),
      // filter(cart => !!cart.id),
      take(10)).subscribe((cart)=>{
      console.log("cart loaded", cart);
    });

    this.cart.cartLines$.pipe(filter(lines => !!lines),take(1)).subscribe((lines)=>{
      this.cartLines.set(lines);
      console.log(lines);
    });
  }

  pay(){
      //#begin# snippet to add product to card
      if(!this.cartId){
        //lng: algo paso con el carrito
        console.log("Problema al cargar el carrito");

        return;
      }

      this.cart.loadCart(this.cartId);
      this.cart.cart$.pipe(
        filter((cart)=>!!cart),
        take(1)
      ).subscribe((cart)=>{
        console.log("cart", cart);
        if(cart.checkoutUrl)
          window.location.href = cart.checkoutUrl;
        else 
          console.log("bad checkout"); //do something here
      });

      //#end# 
  }  

  toHome(){
    this.router.navigate(['/']);
  }
}
