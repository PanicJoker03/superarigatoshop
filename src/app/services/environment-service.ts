import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  // This service can be used to manage environment variables and configurations as necessary.
  public get storeFrontToken(): string {
    //todo: create apollo client and use it to connect with the Shopify API using the store front token from the environment variables.
    // the service is called shopifyservice
    return environment.shopify.storeFrontToken;
  }
}
