import { Component, inject, signal } from '@angular/core';
import { Product } from '../../components/product-grid-item/product.model';
import { ShopifyService } from '../../commerce/shopify-service';
// import { CartService } from '../../commerce/cart-service';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';
import { CartFacade } from '../../store/cart';
import { filter, take } from 'rxjs/operators';
import { OrderListItem } from "../../components/order-list-item/order-list-item";
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-orders',
  imports: [OrderListItem],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {}
