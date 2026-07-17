import { Component, inject } from '@angular/core';
import { Navigation } from "../navigation/navigation";
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [Navigation],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  router = inject(Router);
  btnHeaderClicked(event: MouseEvent) {
    this.router.navigate(['/']).then(()=>{
      console.log('header clicked... navigating to home page');
    });
  }
}
