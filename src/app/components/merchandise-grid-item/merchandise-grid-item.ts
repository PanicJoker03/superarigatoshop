import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-merchandise-grid-item',
  imports: [MatCardModule, RouterLink],
  templateUrl: './merchandise-grid-item.html',
  styleUrl: './merchandise-grid-item.scss',
})
export class MerchandiseGridItem {
  @Input() handle = '';
  @Input() imageUrl = '';
  @Input() title = '';
  @Input() description = '';
}