import { Component, inject, signal } from '@angular/core';
import { Product } from '../../components/product-grid-item/product.model';
import { ShopifyService } from '../../commerce/shopify-service';
import { CartService } from '../../commerce/cart-service';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  imports: [MatCard, MatCardHeader, MatCardModule, MatButtonToggle, MatButtonToggleGroup, MatButtonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private shopifyService =  inject(ShopifyService);
  private cart = inject(CartService);
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
    const currentProduct = this.product();
    if(currentProduct){
      //this.cart.(currentProduct, this.quantity());
      console.log("navigating to payment");
      this.router.navigate(['/pages/payment']);
    }
    else{
      console.error('No product selected to add to cart');
    }
  }
}
