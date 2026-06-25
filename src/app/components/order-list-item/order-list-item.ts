import { Component, inject, Input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CdkObserveContent } from "@angular/cdk/observers";
import { RouterLink } from '@angular/router';
import {MatChip, MatChipsModule} from '@angular/material/chips';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common'
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-order-list-item',
  imports: [MatCardModule, MatButtonModule, RouterLink, MatChipsModule, CurrencyPipe, DatePipe, NgClass, MatIcon],
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
  
  public orderFulfillmentCss(shopifyStatus:string):string{
    return `status-${shopifyStatus.replace('_', '-').toLowerCase()}`;
  }

  public orderFulfillmentTraduction(status:string):string {
    //Simplificando el status de shopify,
    //para que los clientes vean un status mas ameno,
    //escudando la tienda....
    switch(status){
      case 'FULFILLED':
        return 'Enviado';
      case 'UNFULFILLED':
      case 'PARTIALLY_FULFILLED':
      case 'PENDING_FULFILLMENT':
        return 'Trabajando';
      case 'IN_PROGRESS':
        return 'En progreso';
      case 'OPEN':
      case 'ON_HOLD':
      case 'RESTOCKED':
      case 'SCHEDULED':
        return 'Pendiente';
      default:
        throw 'Bad status';
    }
  }
}
