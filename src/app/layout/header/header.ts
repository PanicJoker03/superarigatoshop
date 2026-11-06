import { Component, inject } from '@angular/core';
import { Navigation } from "../navigation/navigation";
import { Router } from '@angular/router';
import { EnvironmentService } from '../../services/environment-service';

@Component({
  selector: 'app-header',
  imports: [Navigation],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  router = inject(Router);
  private environmentService = inject(EnvironmentService);

  get whatsappContactUrl(): string {
    const message = 'Hola super arigato, necesito información por favor';
    return `https://wa.me/${this.environmentService.whatsappPhoneNumber}?text=${encodeURIComponent(message)}`;
  }

  get facebookPageUrl(): string {
    return this.environmentService.urlFacecookPage;
  }

  btnHeaderClicked(event: MouseEvent) {
    this.router.navigate(['/']).then(()=>{
      console.log('header clicked... navigating to home page');
    });
  }
}
