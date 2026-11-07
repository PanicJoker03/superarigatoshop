import { Injectable } from '@angular/core';

//this class will use HttpClient to connect with the Shopify API and fetch data as necessary.
import { HttpClient } from '@angular/common/http';
import { gql } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { Product } from '../components/product-grid-item/product.model';

//we use the gql tag to parse our query string into a query document
//lng: this query is important, it the core of the home catalog
const GET_PRODUCTS = gql`
  query GetProducts($after: String) {
    products(first: 250, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
  query GetProductsByTag($tag: String!, $after: String) {
    products(first: 250, after: $after, query: $tag, sortKey: CREATED_AT, reverse: true) {
      pageInfo {
        hasNextPage
        endCursor
      }
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
    const query = collectionHandle ? GET_PRODUCTS_BY_TAG : GET_PRODUCTS;
    const tag = collectionHandle
      ? collectionHandle === 'microfibra'
        ? 'product_type:Microfibra OR (tag:Microfibra -tag:"Mouse Pad" -tag:Portavasos)'
        : `tag:${collectionHandle}`
      : undefined;
    const fetchPage = (after: string | null) => this.apollo.query({
      query,
      fetchPolicy: 'network-only',
      variables: collectionHandle ? { tag, after } : { after },
    });

    return fetchPage(null).pipe(
      expand((result: any) => {
        const pageInfo = result.data.products.pageInfo;
        return pageInfo.hasNextPage && pageInfo.endCursor
          ? fetchPage(pageInfo.endCursor)
          : EMPTY;
      }),
      map((result: any) => result.data.products.edges),
      reduce((allEdges: any[], edges: any[]) => allEdges.concat(edges), []),
      map((edges: any[]) => {
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
