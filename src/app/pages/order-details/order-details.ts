import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { CurrencyPipe, DatePipe, isPlatformBrowser, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomerOrder, CustomerOrderLine, CustomerService } from '../../commerce/customer-service';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
@Component({
  selector: 'app-order-details',
  imports: [
    MatChipSet,
    MatChip,
    NgClass,
    MatCard,
    DatePipe,
    MatCardContent,
    CurrencyPipe,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss',
})
export class OrderDetails {
  //todo: decode gid param with atob... read parameter...
  private activateRoute = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private platformId = inject(PLATFORM_ID);
  orderStatus = signal<string>('');
  orderId = signal('');
  customerOrder = signal<CustomerOrder | null>(null);
  customerOrderLines = signal<CustomerOrderLine[] | null>(null);

  ngOnInit() {
    //#begin# try to retrieve Customer
    if (isPlatformBrowser(this.platformId)) {
      this.activateRoute.queryParamMap.subscribe((paramMap) => {
        console.log('Route parameters changed');
        console.log(paramMap);
        let orderEncoded: string | null = paramMap.get('orderId');
        this.orderId.set(atob(orderEncoded!));
        //debugger
        console.log(this.orderId);

        //retrieve accessToken
        const accessToken = localStorage.getItem('customerAccessToken');

        //retrieve order details
        this.fetchOrderDetails(this.orderId());
      });
    }
    //#end#
  }

  private fetchOrderDetails(orderId: string) {
    this.customerService.getCustomerOrder(orderId).subscribe((customerOrder) => {
      console.log('customerOrder retrieved successfully!', customerOrder);
      this.customerOrder.set(customerOrder.order);
      this.customerOrderLines.set(customerOrder.lines);
      // fill status
      this.orderStatus.set(this.orderFulfillmentTraduction(this.customerOrder()?.shipmentStatus!));
    });
  }

  public orderFulfillmentCss(shopifyStatus: String): string {
    return `status-${shopifyStatus.replace('_', '-').toLowerCase()}`;
  }

  private orderFulfillmentTraduction(status: string): string {
    //Simplificando el status de shopify,
    //para que los clientes vean un status mas ameno,
    //escudando la tienda....
    switch (status) {
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
