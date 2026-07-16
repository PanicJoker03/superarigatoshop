import { Component } from '@angular/core';
import { MatToolbarRow } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navigation-mobile',
  imports: [MatToolbarRow, MatIconButton, MatIcon],
  templateUrl: './navigation-mobile.html',
  styleUrl: './navigation-mobile.scss',
})
export class NavigationMobile {}
