import { Component, inject, signal } from '@angular/core';
import { ShopifyService } from '../../commerce/shopify-service';
import { ProductGridItem } from '../../components/product-grid-item/product-grid-item';
import { Product } from '../../components/product-grid-item/product.model';
import { ActivatedRoute, Router, ɵEmptyOutletComponent } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [ProductGridItem, ɵEmptyOutletComponent, MatButton, MatIcon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private activateRoute = inject(ActivatedRoute);
  private shopifyService = inject(ShopifyService);
  private router = inject(Router);
  //signal
  products = signal<Product[]>([]);
  collectionHandle = signal<string | null>('');
  titleCollection = signal<string | null>('');

  constructor() {}

  ngOnInit() {
    //subscribe to route parameters to react to changes in the collection handle
    this.activateRoute.queryParamMap.subscribe((params) => {
      console.log('Route parameters changed:', params);
      this.collectionHandle.set(params.get('collectionHandle'));
      this.titleCollection.set(params.get('titleCollection'));
      // match pattern collection handle to current shopify tags
      switch (this.collectionHandle()) {
        case 'mouse-pads':
          this.collectionHandle.set('Mouse Pad');
          break;
        case 'tars':
          this.collectionHandle.set('Tasa');
          break;
        case 'plush':
          this.collectionHandle.set('Peluches');
          break;
        case 'cup-holder':
          this.collectionHandle.set('Portavasos');
          break;
        case 'microfiber':
        case 'microfibras':
          this.collectionHandle.set('microfibra');
          break;
        //default:
        //  this.collectionHandle.set('');
      }

      //validate empty titleCollection
      if (this.titleCollection() == '' || this.titleCollection() == null) {
        this.titleCollection.set('Inicio');
      }

      // Fetch products based on the updated collection handle
      this.shopifyService.getProducts(this.collectionHandle()).subscribe({
        next: (products) => {
          console.log(
            'Products fetched from ShopifyService with collection handle:',
            this.collectionHandle(),
            products,
          );
          this.products.set(products);
        },
        error: (error) => {
          console.error('Error fetching products:', error);
        },
      });
    });
  }

  protected btnStartShoppingClick(event: MouseEvent): void {
    console.log('clicked');
    this.router.navigate(['/']).then((r) => {
      console.log('navigating to home');
    });
  }
}
