import { Component, inject, signal } from '@angular/core';
import { ShopifyService } from '../../commerce/shopify-service';
import { ProductGridItem } from '../../components/product-grid-item/product-grid-item';
import { Product } from '../../components/product-grid-item/product.model';
import { ActivatedRoute, ɵEmptyOutletComponent } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [ProductGridItem, ɵEmptyOutletComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private activateRoute = inject(ActivatedRoute);
  private shopifyService = inject(ShopifyService);
  //signal 
  products = signal<Product[]>([]);

  constructor() {
    // //retrieve the collection handle from the route parameters
    // const collectionHandle = this.activateRoute.snapshot.paramMap.get('collectionHandle');

    // console.log('Home component initialized');
    // // Example usage of the ShopifyService to fetch products
    // this.shopifyService.getProducts("Mouse Pad").subscribe({
    //   next: (products) => {
    //     console.log('Products fetched from ShopifyService:', products);
    //     this.products.set(products);
    //   },
    //   error: (error) => {
    //     console.error('Error fetching products from ShopifyService:', error);
    //   }
    // });
    // console.log('Products in Home component:', this.products);
  }

  ngOnInit(){
    //subscribe to route parameters to react to changes in the collection handle
    this.activateRoute.queryParamMap.subscribe(params => {
      console.log('Route parameters changed:', params);
      let collectionHandle = params.get('collectionHandle');
      // match pattern collection handle to current shopify tags
      switch (collectionHandle) {
        case 'mouse-pads':
          collectionHandle = 'Mouse Pad';
          break;
        case 'tars':
          collectionHandle = 'Tasas';
          break;
        case 'plush':
          collectionHandle = 'Peluches';
          break;
        case 'cup-holder':
          collectionHandle = 'Portavasos';
          break;
        default:
          collectionHandle = null;
      }

      // Fetch products based on the updated collection handle
      this.shopifyService.getProducts(collectionHandle).subscribe({
        next: (products) => {
          console.log('Products fetched from ShopifyService with collection handle:', collectionHandle, products);
          this.products.set(products);
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        }
      });
    });
  }

}
