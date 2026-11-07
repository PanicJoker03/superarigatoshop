import { Component } from '@angular/core';
import servicesData from '../../shared/servicios.json';
import { ServiceGridItem } from '../../components/service-grid-item/service-grid-item';

@Component({
  selector: 'app-services',
  imports: [ServiceGridItem],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  readonly services = servicesData.servicios;
}