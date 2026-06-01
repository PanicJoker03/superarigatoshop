import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),

    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const uri = `${environment.shopify.storeUrl}/api/2025-01/graphql.json`;
      const authLink = setContext((_, { headers }) => ({
        headers: {
          ...headers,
          'X-Shopify-Storefront-Access-Token': environment.shopify.storeFrontToken,
          'Content-Type': 'application/json',
        },
      }));
      return {
        link: from([authLink, httpLink.create({ uri })]),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
