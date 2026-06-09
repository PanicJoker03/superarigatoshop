import { Component, inject, Input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CdkObserveContent } from "@angular/cdk/observers";
import { RouterLink } from '@angular/router';
import {MatChip, MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-order-list-item',
  imports: [MatCardModule, MatButtonModule, RouterLink, MatChipsModule],
  templateUrl: './order-list-item.html',
  styleUrl: './order-list-item.scss',
})
export class OrderListItem {
  @Input() orderId: string = '';
  @Input() imageUrl: string = '';
  @Input() orderDate: Date = new Date;
}
