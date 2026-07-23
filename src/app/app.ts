import { Component, inject, signal } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { ChatbotService } from './components/chatbot/chatbot-service';
import { Navigation } from "./layout/navigation/navigation";
import { NavigationMobile } from './layout/navigation-mobile/navigation-mobile';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { MatMenuItem } from '@angular/material/menu';
import { SwapDirective } from './shared/swap-directive';

enum DeviceViewMode {
  Mobile = 'mobile',
  Web = 'web'
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Navigation,
    NavigationMobile,
    NgClass,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatListItem,
    MatList,
    MatDivider,
    MatMenuItem,
    RouterLink,
    SwapDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('superarigatoshop');
  sidenavOpened = signal(false);

  breakpointObserver = inject(BreakpointObserver);
  router = inject(Router);
  deviceViewMode = signal<DeviceViewMode>(<DeviceViewMode>'');
  isReady = signal(false);
  constructor(private chatbot: ChatbotService) {}

  ngOnInit() {
    console.log('App component initialized');
    console.log('loading chat');
    this.handleDeviceViewMode();
    this.chatbot.loadChat();
  }

  //it checks if the device is mobile or web
  handleDeviceViewMode(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((breakpoints) => {
      console.log('Breakpoint is ', breakpoints);
      if (breakpoints.matches) {
        //set device view mode to mobile
        this.deviceViewMode.set(DeviceViewMode.Mobile);
        //listen navigation to had some actions on side bar
        this.router.events.pipe(filter((e) => e instanceof NavigationStart)).subscribe((event) => {
          console.log('Navigation started, closing sidebar');
          this.sidenavOpened.set(false);
          //todo: test my changes
        });
      } else {
        this.deviceViewMode.set(DeviceViewMode.Web);
      }
      this.isReady.set(true);
      //}
    });
  }

  sideNavToggle() {
    console.log('Side Nav Toggle');
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  ngAfterViewInit() {}

  onSwapeLeftSideNav() {
    this.sidenavOpened.set(false);
  }

  onSwipeRightSideNav(){}

  protected readonly DeviceViewMode = DeviceViewMode;
}
