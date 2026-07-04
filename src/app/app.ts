import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { ChatbotService } from './components/chatbot/chatbot-service';
import { Navigation } from "./layout/navigation/navigation";
import { NavigationMobile } from './layout/navigation-mobile/navigation-mobile';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';

enum DeviceViewMode {
  Mobile = 'mobile',
  Web = 'web'
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Navigation, NavigationMobile, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('superarigatoshop');
  breakpointObserver = inject(BreakpointObserver);
  deviceViewMode = signal<DeviceViewMode>(<DeviceViewMode>'');
  isReady = signal(false);
  constructor(private chatbot: ChatbotService) {}

  ngOnInit() {
    console.log('App component initialized');
    console.log('loading chat');
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      //.pipe(takeUntilDestroyed())
      .subscribe((breakpoints) => {
        //if(breakpoints && breakpoints.length > 0){
        console.log('Breakpoint is ', breakpoints);
        if (breakpoints.matches) {
          this.deviceViewMode.set(DeviceViewMode.Mobile);
        } else {
          this.deviceViewMode.set(DeviceViewMode.Web);
        }
        this.isReady.set(true);
        //}
      });

    this.chatbot.loadChat();
  }

  ngAfterViewInit() {}

  protected readonly DeviceViewMode = DeviceViewMode;
}
