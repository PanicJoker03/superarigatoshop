import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-under-construction',
  imports: [MatIcon, MatButton],
  templateUrl: './under-construction.html',
  styleUrl: './under-construction.scss',
})
export class UnderConstruction {
  private router = inject(Router);

  protected btnStartShoppingClick(event: MouseEvent): void {
    console.log('clicked');
    this.router.navigate(['/']).then((r) => {
      console.log('navigating to home');
    });
  }
}
