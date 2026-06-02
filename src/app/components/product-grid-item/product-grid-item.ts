import { Component, Input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-product-grid-item',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './product-grid-item.html',
  styleUrl: './product-grid-item.scss',
})
export class ProductGridItem {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() price: string = '';
}
