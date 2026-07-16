import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  platformId = inject(PLATFORM_ID);

  public logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('customerAccessToken');
    }
  }

  public login(accessToken: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('customerAccessToken', accessToken);
    }
  }

  public signed(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('customerAccessToken');
    }
    return false;
  }
}
