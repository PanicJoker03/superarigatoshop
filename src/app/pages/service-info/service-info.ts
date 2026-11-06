import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EnvironmentService } from '../../services/environment-service';
import servicesData from '../../shared/servicios.json';

interface ServiceInfoEntry {
  handle: string;
  nombre: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-service-info',
  imports: [MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './service-info.html',
  styleUrl: './service-info.scss',
})
export class ServiceInfo {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private environmentService = inject(EnvironmentService);

  service = signal<ServiceInfoEntry | null>(null);

  ngOnInit(): void {
    const routedService = this.router.getCurrentNavigation()?.extras.state?.['service'] as
      | ServiceInfoEntry
      | undefined;

    this.route.queryParamMap.subscribe((params) => {
      const handle = params.get('handle');
      const serviceFromRoute = routedService?.handle === handle ? routedService : undefined;
      const service = serviceFromRoute ?? servicesData.servicios.find((entry) => entry.handle === handle);
      this.service.set(service ?? null);
    });
  }

  get whatsappRequestUrl(): string {
    const serviceName = this.service()?.nombre ?? 'un servicio';
    const message = encodeURIComponent(`Hola, me interesa solicitar el servicio de ${serviceName}.`);
    return `https://wa.me/${this.environmentService.whatsappPhoneNumber}?text=${message}`;
  }
}