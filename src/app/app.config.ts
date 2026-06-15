import { registerLocaleData } from '@angular/common'
import localeEsMx  from  '@angular/common/locales/es-MX'
import { LOCALE_ID } from '@angular/core'
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
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { cartReducer } from './store/cart/cart.reducer';
import { CartEffects } from './store/cart/cart.effects';

//register locale es-MX
registerLocaleData(localeEsMx);

export const appConfig: ApplicationConfig = {
  providers: [
    //provide es-MX
    { provide: LOCALE_ID, useValue: 'es-MX' },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideStore({
      cart: cartReducer,
    }),
    provideEffects([CartEffects]),

    provideApollo(() => {
      //this provide setups shopify store front token and store url.
      //Configuration values assigned on environment.ts file
      console.log('Initializing Apollo Client with Shopify Storefront API');
      console.log('Shopify Store URL:', environment.shopify.storeUrl);
      console.log('Shopify Storefront Token:', environment.shopify.storeFrontToken);
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