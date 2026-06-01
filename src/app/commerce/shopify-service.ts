import { Injectable } from '@angular/core';

//this class will use HttpClient to connect with the Shopify API and fetch data as necessary.
import { HttpClient } from '@angular/common/http';
import { gql } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { EnvironmentService } from '../services/environment-service';

//we use the gql tag to parse our query string into a query document
const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          images(first: 1) {
            edges {
              node {
                src
              }
            }
          }
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ShopifyService {
  constructor(private http: HttpClient, private apollo: Apollo, private environment: EnvironmentService) {}

  // Example method to fetch products from Shopify API
  getProducts(collectionHandle: string | undefined = undefined) {
    console.log('Fetching products from Shopify API with collection handle:', collectionHandle);
    // const shopifyApiUrl = 'https://example-shopify-store.myshopify.com/products.json';
    // const shopName = 'superarigatodev';
    // const apiVersion = '2026-01'; // Use the appropriate API version
    // const productsEndpoint = `https://${shopName}.myshopify.com/api/${apiVersion}/graphql.json`;
    //https://superarigatodev.myshopify.com/api/2026-01
    //return this.http.post(productsEndpoint, { query: GET_PRODUCTS });
    return this.apollo.query({
      query: GET_PRODUCTS
    });
  }
}
