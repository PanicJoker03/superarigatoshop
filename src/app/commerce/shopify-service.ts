import { Injectable } from '@angular/core';

//this class will use HttpClient to connect with the Shopify API and fetch data as necessary.
import { HttpClient } from '@angular/common/http';
import { gql } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Product } from '../components/product-grid-item/product.model';

//we use the gql tag to parse our query string into a query document
//lng: this query is important, it the core of the home catalog
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
          variants(first: 1) {
            edges {
              node {
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_PRODUCTS_BY_TAG = gql`
  query GetProductsByTag($tag: String!) {
    products(first: 50, query: $tag, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          description
          productType
          tags
          images(first: 1) {
            edges {
              node {
                src
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: ID!) {
    product(id: $id) {
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
      variants(first: 1) {
        edges {
          node {
            id
            priceV2 {
              amount
              currencyCode
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
  constructor(private apollo: Apollo) {}

  // Example method to fetch products from Shopify API
  getProducts(collectionHandle: string | null | undefined = undefined): Observable<Product[]> {
    console.log('Fetching products from Shopify API with collection handle:', collectionHandle);
    return this.apollo.query({
      query: collectionHandle ? GET_PRODUCTS_BY_TAG : GET_PRODUCTS,
      fetchPolicy: 'network-only',
      variables: {
        tag: collectionHandle
          ? collectionHandle === 'microfibra'
            ? 'product_type:Microfibra OR (tag:Microfibra -tag:"Mouse Pad" -tag:Portavasos)'
            : `tag:${collectionHandle}`
          : undefined,
      },
    }).pipe(
      map((result: any) => {
        console.log('Raw response from Shopify API:', result);
        const edges = result.data.products.edges;
        const matchingEdges = collectionHandle
          ? edges.filter((edge: any) => {
              const normalizedHandle = collectionHandle.trim().toLowerCase();
              const tags = edge.node.tags ?? [];
              const hasExactTag = tags.some(
                (tag: string) => tag.trim().toLowerCase() === normalizedHandle,
              );

              if (normalizedHandle === 'microfibra') {
                const hasOtherCategoryTag = tags.some((tag: string) =>
                  ['mouse pad', 'portavasos'].includes(tag.trim().toLowerCase()),
                );
                return edge.node.productType?.trim().toLowerCase() === 'microfibra' ||
                  (hasExactTag && !hasOtherCategoryTag);
              }

              return hasExactTag;
            })
          : edges;

        return matchingEdges.map((edge: any): Product => {
          const variantPrice = edge.node.variants?.edges?.[0]?.node?.priceV2;
          return {
            id: edge.node.id,
            variantId: "",
            title: edge.node.title,
            description: edge.node.description || '',
            price: variantPrice ? `${variantPrice.amount} ${variantPrice.currencyCode}` : 'N/A',
            imageUrl: edge.node.images.edges[0]?.node.src || '',
          };
        });
      })
    );
  }

  getProductDetails(productId: string): Observable<Product> {
    return this.apollo.query({
      query: GET_PRODUCT_DETAILS,
      variables: {
        id: productId,
      },
    }).pipe(
      map((result: any) => {
        const product = result.data.product;
        const variantPrice = product?.variants?.edges?.[0]?.node?.priceV2;
        const variantId = product?.variants?.edges?.[0]?.node?.id;
        return {
          id: product.id,
          variantId: variantId || '',
          title: product.title,
          description: product.description || '',
          price: variantPrice ? `${variantPrice.amount} ${variantPrice.currencyCode}` : 'N/A',
          imageUrl: product.images.edges[0]?.node.src || '',
        };
      })
    );
  }
}
