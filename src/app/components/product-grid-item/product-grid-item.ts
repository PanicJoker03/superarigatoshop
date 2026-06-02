import { Component, inject, Input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CdkObserveContent } from "@angular/cdk/observers";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-grid-item',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './product-grid-item.html',
  styleUrl: './product-grid-item.scss',
})
export class ProductGridItem {
  // router = inject(Router);
  @Input() productId: string = '';
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() price: string = '';
  
  onClick() {
    console.log('Product clicked:', this.title);
    //navigate to product details page or open a modal with more information
    // this.router.navigate(['/products', this.productId]);
  }
}
