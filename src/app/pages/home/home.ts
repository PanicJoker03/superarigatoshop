import { Component, signal } from '@angular/core';
import { ShopifyService } from '../../commerce/shopify-service';
import { ProductGridItem } from '../../components/product-grid-item/product-grid-item';
import { Product } from '../../components/product-grid-item/product.model';
import { ɵEmptyOutletComponent } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [ProductGridItem, ɵEmptyOutletComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  //signal 
  products = signal<Product[]>([]);
  constructor(private shopifyService: ShopifyService) {
    console.log('Home component initialized');
    // Example usage of the ShopifyService to fetch products
    this.shopifyService.getProducts().subscribe({
      next: (products) => {
        console.log('Products fetched from ShopifyService:', products);
        this.products.set(products);
      },
      error: (error) => {
        console.error('Error fetching products from ShopifyService:', error);
      }
    });
    console.log('Products in Home component:', this.products);
  }
}
