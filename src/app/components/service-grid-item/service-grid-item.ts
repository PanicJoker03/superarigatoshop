import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-grid-item',
  imports: [MatCardModule, RouterLink],
  templateUrl: './service-grid-item.html',
  styleUrl: './service-grid-item.scss',
})
export class ServiceGridItem {
  @Input() handle = '';
  @Input() imageUrl = '';
  @Input() title = '';
  @Input() description = '';
}