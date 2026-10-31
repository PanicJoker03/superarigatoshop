import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { SessionService } from '../../services/session-service';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { CartBottomSheet } from '../../components/cart-bottom-sheet/cart-bottom-sheet';


@Component({
  selector: 'app-navigation',
  imports: [RouterLink, MatMenuModule, MatButtonModule, MatBottomSheetModule, NgOptimizedImage],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  sessionIcon = signal('');

  session = inject(SessionService);
  router = inject(Router);
  private bottomSheet = inject(MatBottomSheet);

  openCart(): void {
    this.bottomSheet.open(CartBottomSheet, {
      panelClass: 'arigato-cart-bottom-sheet',
      ariaLabel: 'Carrito de compras',
    });
  }

  ngOnInit(): void {
    //temporal fix, listen for signed each 100 miliseconds
    //the correct way would be using a reducer with ngnx state
    setInterval(()=>{
      if (this.session.signed()) {
        this.sessionIcon.set('/img/logout-icon.svg');
      } else {
        this.sessionIcon.set('/img/user.svg');
      }
    }, 100);
  }

  onBtnSessionClick(event: MouseEvent) {
    console.log('session login/logout');
    if(this.session.signed()) {
      this.session.logout();
      this.router.navigate(['/']).then();
    }
    else {
      this.router.navigate(['/signin']);
    }
  }
}
