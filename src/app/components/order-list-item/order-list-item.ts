import { Component, inject, Input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CdkObserveContent } from "@angular/cdk/observers";
import { RouterLink } from '@angular/router';
import {MatChip, MatChipsModule} from '@angular/material/chips';
import { CurrencyPipe, DatePipe } from '@angular/common'

@Component({
  selector: 'app-order-list-item',
  imports: [MatCardModule, MatButtonModule, RouterLink, MatChipsModule, CurrencyPipe, DatePipe],
  templateUrl: './order-list-item.html',
  styleUrl: './order-list-item.scss',
})
export class OrderListItem {
  @Input() orderNumber: string = '';
  @Input() imageUrl: string = '';
  @Input() orderStatus: string = '';
  @Input() orderDate: Date = new Date;
  @Input() productSummary:string = ''
  @Input() totalPrice:number = 0;
}
