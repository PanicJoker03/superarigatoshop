import { Component, inject, output, signal } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session-service';

@Component({
  selector: 'app-navigation-mobile',
  imports: [MatToolbarRow, MatIconButton, MatIcon, NgOptimizedImage, RouterLink, MatToolbar],
  templateUrl: './navigation-mobile.html',
  styleUrl: './navigation-mobile.scss',
})
export class NavigationMobile {
  sessionIcon = signal('');

  session = inject(SessionService);
  router = inject(Router);
  public menuToggled = output();

  ngOnInit() {
    //temporal fix, listen for signed each 100 miliseconds
    //the correct way would be using a reducer with ngnx state
    setInterval(() => {
      if (this.session.signed()) {
        this.sessionIcon.set('/img/logout-icon.svg');
      } else {
        this.sessionIcon.set('/img/user.svg');
      }
    }, 100);
  }

  btnMenuClicked(event: MouseEvent) {
    console.log('Menu Clicked');
    this.menuToggled.emit();
  }

  onBtnSessionClick(event: MouseEvent) {
    console.log('session login/logout');
    if (this.session.signed()) {
      this.session.logout();
      this.router.navigate(['/']).then();
    } else {
      this.router.navigate(['/signin']);
    }
  }
}
