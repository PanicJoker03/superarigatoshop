import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EnvironmentService } from '../services/environment-service';
import { Apollo, gql } from 'apollo-angular';

export interface CartLine {
  id: string;
  merchandiseId: string;
  title: string;
  quantity: number;
  price: string;
  subtotal: number;
  imageUrl?: string;
}

export interface Cart {
  id: string;
  checkoutUrl?: string;
  totalQuantity: number;
  lines: CartLine[];
}

const CART_LINE_FRAGMENT = gql`
  fragment CartLineFields on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        priceV2 {
          amount
          currencyCode
        }
        image {
          url
        }
        product {
          title
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = gql`
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 20) {
          edges {
            node {
              ...CartLineFields
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_LINE_FRAGMENT}
`;

const CART_LINES_ADD_MUTATION = gql`
  mutation AddLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 20) {
          edges {
            node {
              ...CartLineFields
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_LINE_FRAGMENT}
`;

const CART_LINES_UPDATE_MUTATION = gql`
  mutation UpdateLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 20) {
          edges {
            node {
              ...CartLineFields
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_LINE_FRAGMENT}
`;

const CART_LINES_REMOVE_MUTATION = gql`
  mutation RemoveLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 20) {
          edges {
            node {
              ...CartLineFields
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_LINE_FRAGMENT}
`;

const GET_CART_QUERY = gql`
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 20) {
        edges {
          node {
            ...CartLineFields
          }
        }
      }
    }
  }
  ${CART_LINE_FRAGMENT}
`;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly endpoint: string;
  private readonly headers: HttpHeaders;

  constructor(
    private environment: EnvironmentService, 
    private apollo:Apollo) {
    this.endpoint = `${this.environment.storeUrl}/api/${this.environment.apiVersion}/graphql.json`;
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': this.environment.storeFrontToken,
    });
  }

  public createCart(variantId: string, quantity = 1): Observable<Cart> {
    return this.apollo.mutate({
      mutation: CREATE_CART_MUTATION,
      variables: {
        input: {
          lines: [
            {
              merchandiseId: variantId,
              quantity,
            },
          ],
        },
      }
    }).pipe(map((response) => this.mapCartResponse(response, 'cartCreate')));
  }

  public addLine(cartId: string, variantId: string, quantity = 1): Observable<Cart> {
    return this.apollo.mutate({
      mutation: CART_LINES_ADD_MUTATION,
      variables: {
        cartId,
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          },
        ],
      }
    }).pipe(map((response) => this.mapCartResponse(response, 'cartLinesAdd')));
  }

  public updateLine(cartId: string, lineId: string, quantity: number): Observable<Cart> {
    return this.apollo.mutate({
      mutation: CART_LINES_UPDATE_MUTATION,
      variables: {
        cartId,
        lines: [
          {
            id: lineId,
            quantity,
          },
        ],
      }
    }).pipe(map((response) => this.mapCartResponse(response, 'cartLinesUpdate')));
  }

  public removeLines(cartId: string, lineIds: string[]): Observable<Cart> {
    return this.apollo.mutate({
      mutation: CART_LINES_REMOVE_MUTATION,
      variables: {
        cartId,
        lineIds,
      }
    }).pipe(map((response) => this.mapCartResponse(response, 'cartLinesRemove')));
  }

  public getCart(cartId: string): Observable<Cart> {
    return this.apollo.query<{ cart: any }>({
      query: GET_CART_QUERY,
      variables: {
        cartId,
      }
    }).pipe(map((response) => this.mapCartObject(response.data?.cart)));
  }

  private mapCartResponse(response: any, payloadName: string): Cart {
    if (response?.errors?.length) {
      throw new Error(response.errors.map((error: any) => error.message).join(', '));
    }

    const payload = response?.data?.[payloadName];

    if (!payload) {
      throw new Error(`Missing ${payloadName} response from Shopify.`);
    }

    if (payload.userErrors?.length) {
      throw new Error(payload.userErrors.map((error: any) => error.message).join(', '));
    }

    return this.mapCartObject(payload.cart);
  }

  private mapCartObject(cart: any): Cart {
    const lines = this.mapCartLines(cart?.lines);
    return {
      id: cart?.id,
      checkoutUrl: cart?.checkoutUrl,
      totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
      lines,
    };
  }

  private mapCartLines(linesConnection: any): CartLine[] {
    const edges = linesConnection?.edges || [];
    return edges.map((edge: any) => {
      const node = edge?.node || {};
      const merchandise = node.merchandise || {};
      const priceAmount = merchandise.priceV2?.amount || '0.00';
      const currency = merchandise.priceV2?.currencyCode || '';
      const title = merchandise.product?.title || merchandise.title ||  'Product';
      const subtotal = Number.parseFloat(priceAmount) * node.quantity;
      return {
        id: node.id,
        merchandiseId: merchandise.id,
        title,
        quantity: node.quantity,
        price: `${priceAmount} ${currency}`,
        imageUrl: merchandise.image?.url,
        subtotal
      };
    });
  }
}
