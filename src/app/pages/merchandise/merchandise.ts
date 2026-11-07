import { Component } from '@angular/core';
import merchandiseData from '../../shared/merchandise.json';
import { MerchandiseGridItem } from '../../components/merchandise-grid-item/merchandise-grid-item';

@Component({
  selector: 'app-merchandise',
  imports: [MerchandiseGridItem],
  templateUrl: './merchandise.html',
  styleUrl: './merchandise.scss',
})
export class Merchandise {
  readonly merchandise = merchandiseData.servicios;
}