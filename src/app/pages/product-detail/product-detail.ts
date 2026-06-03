import { Component, inject, signal } from '@angular/core';
import { Product } from '../../components/product-grid-item/product.model';
import { ShopifyService } from '../../commerce/shopify-service';
// import { CartService } from '../../commerce/cart-service';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';
import { CartFacade } from '../../store/cart';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  imports: [MatCard, MatCardHeader, MatCardModule, MatButtonToggle, MatButtonToggleGroup, MatButtonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private shopifyService =  inject(ShopifyService);
  private cart = inject(CartFacade);
  private activateRoute = inject(ActivatedRoute);
  private router = inject(Router);
  product = signal<Product | null>(null);
  quantity = signal<number>(1);
  ngOnInit() {
    //fetch product details by id and set the product signal
    this.activateRoute.queryParamMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.shopifyService.getProductDetails(productId).subscribe(product => {
          console.log('Product details fetched from ShopifyService:', product);
          this.product.set(product);
        });
      }
      else{
        //todo: redirect to not found page
        console.error('Product ID not found in route parameters');
      }
    });
  }
  decreaseQuantity() {
    this.quantity.update(q => Math.max(1, q - 1));
    // throw new Error('Method not implemented.');
  }
  increaseQuantity() {
    this.quantity.update(q => q + 1);
    // throw new Error('Method not implemented.');
  }
  buy(){
    console.log("buying ... ");
    const currentProduct = this.product();
    if(currentProduct){
      //this.cart.(currentProduct, this.quantity());
      console.log("navigating to payment");
      // this.router.navigate(['/pages/payment']);

      const variantId = this.product()?.variantId;
      if (!variantId) {
        console.error('Product variant ID is missing');
        return;
      }

      //#begin# snippet to add product to card
      const cartId = localStorage.getItem('cartId');

      if(!cartId){
        console.log("no cart loaded");
        this.cart.createCart(variantId, this.quantity());
      }
      else{        
        console.log("cart loaded");
        this.cart.addLineToCart(cartId, variantId, this.quantity());
      }
      
      this.cart.cartLines$.pipe(take(1)).subscribe((cart:Array<{}>)=>{
        console.log(cart);
        //patch if empty then recreate cart 
        let cartValid = true;
        if(!cart) 
          cartValid = false;
        if(cartValid)
          if(cart.length == 0)
            cartValid = false;
        if(!cartValid)
          this.cart.createCart(variantId, this.quantity());
      });

      //rxjs to the rescue, wait till cart available
      this.cart.cartCheckoutUrl$.pipe(
        filter(url => !!url),
        take(1)
      ).subscribe((url)=>{
        console.log("url for payment", url);
        this.router.navigate(['/pages/payment']).finally(()=>{
          console.log("finally happened");
        });
        //window.location.href = url        
      });
      //#end# snippet to add product to card
    }
    else{
      console.error('No product selected to add to cart');
    }
  }
}
