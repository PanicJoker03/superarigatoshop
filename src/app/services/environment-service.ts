import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface CustomerCreationRequired {
  firstName : string,
  lastName : string,
  fakePhone : string
} 

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  // This service exposes Shopify storefront configuration values used by commerce services.
  public get isProduction():boolean {
    return environment.production;
  }

  public get storeFrontToken(): string {
    return environment.shopify.storeFrontToken;
  }

  public get storeUrl(): string {
    return environment.shopify.storeUrl;
  }

  public get apiVersion(): string {
    return environment.shopify.apiVersion;
  }

  public get chatbotIntegrationID(): string {
    return environment.chatbotIntegrationID;
  }

  public get chatbotServiceInstanceID(): string {
    return environment.chatbotServiceInstanceID;
  }

  public get customerCreationRequireds() : CustomerCreationRequired {
    return environment.customerCreationRequired;
  } 

  public get ordersFallbackImage():string {
    return environment.ordersFallbackImage;
  }

  public get whatsappPhoneNumber(): string {
    return environment.whatsappPhoneNumber;
  }
}
