import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Product } from '../../components/product-grid-item/product.model';
import { ShopifyService } from '../../commerce/shopify-service';
// import { CartService } from '../../commerce/cart-service';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatButton, MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';
import { CartFacade } from '../../store/cart';
import { filter, take } from 'rxjs/operators';
import { OrderListItem } from "../../components/order-list-item/order-list-item";
import {MatMenuModule} from '@angular/material/menu';
import { CustomerOrder, CustomerService } from '../../commerce/customer-service';
import { isPlatformBrowser } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-orders',
  imports: [OrderListItem, MatIcon, MatButton],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  router = inject(Router);
  customer = inject(CustomerService);
  platformId = inject(PLATFORM_ID);
  customerOrders = signal<CustomerOrder[]>([]);
  ngOnInit() {
    //#begin# try to retrieve Customer
    if (isPlatformBrowser(this.platformId)) {
      console.log('attempting to retrieve customer orders');
      const accessToken = localStorage.getItem('customerAccessToken');
      if (accessToken) {
        //retrieve orders ...
        this.customer.getCustomerOrders(accessToken).subscribe({
          next: (orders) => {
            console.log('orders retrieved successfully!', orders);
            this.customerOrders.set(orders);
          },
          error: (error) => {
            console.log('orders retrieved failed!', error);
          },
        });
      } else {
        //redirect to sign in
        console.log('navigating to sign in, token not found...');
        this.router.navigate(['/signin']);
      }
    }
    //#end#
  }

  protected btnStartShoppingClick(event:MouseEvent): void {
    console.log('clicked');
    this.router.navigate(['/']).then(r => {
      console.log("navigating to home");
    });
  }
}
