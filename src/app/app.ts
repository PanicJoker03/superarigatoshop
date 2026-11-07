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
import { MatDivider, MatList, MatListItem, MatNavList } from '@angular/material/list';
import { MatMenuItem } from '@angular/material/menu';
import { SwapDirective } from './shared/swap-directive';
import { MatIcon } from '@angular/material/icon';
import { EnvironmentService } from './services/environment-service';

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
    MatNavList,
    MatIcon,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('superarigatoshop');
  sidenavOpened = signal(false);

  breakpointObserver = inject(BreakpointObserver);
  router = inject(Router);
  private environmentService = inject(EnvironmentService);
  deviceViewMode = signal<DeviceViewMode>(<DeviceViewMode>'');
  isReady = signal(false);
  constructor(private chatbot: ChatbotService) {}

  get whatsappContactUrl(): string {
    const message = 'Hola super arigato, necesito información por favor';
    return `https://wa.me/${this.environmentService.whatsappPhoneNumber}?text=${encodeURIComponent(message)}`;
  }

  get facebookPageUrl(): string {
    return this.environmentService.urlFacecookPage;
  }

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
          this.collapseNavigation();
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
    this.collapseNavigation();
  }

  onSwipeRightSideNav() {}

  collapseNavigation(){
    this.sidenavOpened.set(false);
    this.menuPersonajesExpanded.set(false);
    this.menuEnviosExpanded.set(false);
  }

  //#begin: mobile side nav menus
  menuPersonajesExpanded = signal<boolean>(false);
  toggleMenuPersonajes(): void {
    this.menuPersonajesExpanded.set(!this.menuPersonajesExpanded());
  }

  menuEnviosExpanded = signal<boolean>(false);
  toggleMenuEnvios(): void {
    this.menuEnviosExpanded.set(!this.menuEnviosExpanded());
  }

  //#end: mobile side nav menus

  protected readonly DeviceViewMode = DeviceViewMode;
}
