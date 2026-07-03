import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { EnvironmentService } from '../services/environment-service';

export interface CustomerCreateInput {
  acceptsMarketing:boolean,
  email : string,
  firstName : string,
  lastName : string,
  password : string,
  phone : string
};

export interface CustomerUserError {
  code: string
  message : string
};

export interface CustomerCreateResponse {
  data : {
    customerCreate : {
      customer: object,
      customerUserErrors: CustomerUserError[] 
    }
  },
  extensions : {
    cost: {
      requestedQueryCost: number
    }
  },
  loading: boolean
};

export interface CustomerAccessTokenCreateResponse {
  data : {
    customerAccessTokenCreate : {
      customerAccessToken: {
        accessToken : string,
        expiresAt : Date
      },
      customerUserErrors: CustomerUserError[] 
    }
  },
  extensions : {
    cost: {
      requestedQueryCost: number
    }
  },
  loading: boolean
};

//todo: retrieve id from localstorage...
export interface CustomerActivateInput {
  id : string,
  input : {
    activationToken : string,
    password : string
  }
};

// export interface CustomerOrder {

// }

//used on order list
export interface CustomerOrder {
  id: string,
  orderNumber: number,
  processedAt : Date,
  shipmentStatus: string,
  orderSummary: string,
  totalPrice: {
    amount: number,
    currencyCode: string
  },
  productImageUrl:string
}

export interface CustomerOrderLine {
  quantity: number,
  title: string,
  variantId:string,
  price?: {
    amount: number,
    currencyCode: string
  }
  productImageUrl: string
}

//used on order details screen
export interface CustomerOrderDetail {
  order: CustomerOrder;
  lines: CustomerOrderLine[];
}


/*
export interface CustomerOrderDetailLine {

  title: string;
  quantity: number;
  variantId: string;
  productImageUrl: string;
}
 */

//graphql calls 
const CREATE_CUSTOMER_MUTATION = gql`
mutation createCustomerAccount($input: CustomerCreateInput!) {
  customerCreate(input: $input){
    customer {
      id
      email
      firstName
      lastName
      phone
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`;

const ACTIVATE_CUSTOMER_ACCOUNT_MUTATION = gql`
mutation activateCustomerAccount($id: ID!, $input: CustomerActivateInput!) { 
  customerActivate(input: $input, id: $id) {
    customer {
      id
      email
      firstName
      lastName
      phone
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`;

const GET_CUSTOMER_ACCESS_TOKEN_CREATE = gql`
mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
`;

const GET_CUSTOMER_MUTATION = gql`
query getCustomer($email : String!) { 
   customer(email: $email) {
     id
     email
     firstName
     lastName
     phone
     isActive
     isEmailConfirmed
     addresses {
       edges {
         node {
           id
           address1
           city
           country {
             code
           }
           stateProvince {
             code
           }
           zipCode
         }
       }
     }
   } 
}`;

const GET_CUSTOMER_ADDRESS_MUTATION = gql`
mutation updateCustomerAddress($input: CustomerAddressInput!, $id : ID!) { 
  customerUpdateAddress(input: $input, id: $id) {
    customer {
      email
      firstName
      lastName
      phone
      addresses {
        edges {
          node {
            address1
            city
            country {
              code
            }
            stateProvince {
              code
            }
            zipCode
          }
        }
      }
    } 
  }
}`;

const GET_CUSTOMER_ADDRESS_BY_ID_MUTATION = gql`
mutation updateCustomerAddressById($input: CustomerAddressInput!, $id : ID!) { 
  customerUpdateAddressByCustomerId(input: $input, id: $id) {
    customer {
      email
      firstName
      lastName
      phone
      addresses {
        edges {
          node {
            address1
            city
            country {
              code
            }
            stateProvince {
              code
            }
            zipCode
          }
        }
      }
    } 
  }
}`;

const GET_CUSTOMER_ORDERS = gql
  `query getCustomerOrders($customerAccessToken: String!, $first : Int!) { 
  customer(customerAccessToken: $customerAccessToken) {
    id
    orders(first: $first){
      edges{
        node{
          id
          orderNumber
          processedAt
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }

          lineItems(first:20){
            edges {
              node {
                title
                quantity
                variant {
                  id
                  image {
                    url
                    altText
                  }

                  product {
                    id
                    title
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

const GET_CUSTOMER_ORDER_QUERY = gql`
  query getCustomerOrder($orderGid: ID!) {
    node(id: $orderGid) {
      ... on Order {
        id
        name
        processedAt
        totalPriceV2 {
          amount
          currencyCode
        }
        financialStatus
        fulfillmentStatus
        lineItems(first: 20) {
          edges {
            node {
              title
              quantity
              variant {
                id
                priceV2 {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
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
export class CustomerService {
  constructor(private apollo:Apollo, private environment:EnvironmentService){}

  customerAccessTokenCreate(email: string, password: string): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: GET_CUSTOMER_ACCESS_TOKEN_CREATE,
        variables: {
          input: {
            email: email,
            password: password
          }
        }
      }
    );
  }

  createCustomer(email:string, password:string, phone:string):Observable<CustomerCreateResponse>{
    const requiredValues = this.environment.customerCreationRequireds;
    const customer:CustomerCreateInput = {
        acceptsMarketing : false,
        email : email,
        firstName : requiredValues.firstName,
        lastName : requiredValues.lastName,
        password : password,
        phone : this.environment.isProduction ? phone.toString() : this.environment.customerCreationRequireds.fakePhone
    };

    return this.apollo.mutate({
      mutation : CREATE_CUSTOMER_MUTATION,
      variables : {
        input : customer
      }
    }).pipe(map((result:any)=>{
      console.log("customer created response from shopify api: ", result);
      return result;
    }));
  }

  getCustomerOrders(accessToken:string):Observable<CustomerOrder[]>{
    return this.apollo.query({
      query: GET_CUSTOMER_ORDERS,
      variables: {
        first: 110,
       customerAccessToken : accessToken
     }
    }).pipe(map((response:any)=>{
      console.log("Store Front response:" , response);
      const customerOrders = response.data.customer.orders.edges;
      const orders:CustomerOrder[] = customerOrders.map((edge:any)=>{
        const orderInfo = edge.node;
        //reducing item product titles
        const orderSummary:string = orderInfo.lineItems.edges.reduce((acumm:string, edge:any, index:number)=>{
          return `${acumm}${index==0 ? "" : ", "}${edge.node.quantity} ${edge.node.title}`; 
        }, "");
        console.log(orderInfo.lineItems.edges[0].node);
        //validate variant image, can be null for drafting products . . . .
        const variant = orderInfo.lineItems.edges[0].node.variant;
        let productImageUrl = "";
        if(variant){
          productImageUrl = variant.image.url;
        }
        else {
          productImageUrl = this.environment.ordersFallbackImage;
        }
        //summarizing information in legible format
        //console.log(`order id: ${orderInfo.id}`);
        return <CustomerOrder>{
          id: orderInfo.id,
          orderNumber: orderInfo.orderNumber,
          processedAt: orderInfo.processedAt,
          shipmentStatus: orderInfo.fulfillmentStatus, //todo: retrieve code from gql
          orderSummary: orderSummary,
          totalPrice: {
            amount: Number.parseFloat(orderInfo.totalPrice.amount),
            currencyCode: orderInfo.totalPrice.currencyCode
          },
          productImageUrl: productImageUrl
        };
      });
      return orders;
    }));
  }

  getCustomerOrder(orderGid:string):Observable<CustomerOrderDetail>{
    return this.apollo.query({
      query: GET_CUSTOMER_ORDER_QUERY,
      variables: {
        orderGid: orderGid
      }
    }).pipe(map((response:any)=>{
      console.log("Store front response:" , response);
      const orderNode = response.data.node;
      //transformation, get order data
      const order: CustomerOrder = {
        id: orderNode.id,
        orderNumber: orderNode.name.replace('#', ''),
        processedAt: orderNode.processedAt,
        shipmentStatus: orderNode.fulfillmentStatus,
        orderSummary: '',
        totalPrice: {
          amount: Number.parseFloat(orderNode.totalPriceV2.amount),
          currencyCode: orderNode.totalPriceV2.currencyCode,
        },
        productImageUrl: "",
      };

      //reduce orders lines to readable format...
      const orderLines: CustomerOrderLine[] = orderNode.lineItems.edges
        .reduce((accum:any, current:any)=>{
          console.log("procesando linea", current)
          const variant = current.node.variant;
          const orderLine: CustomerOrderLine = <CustomerOrderLine>{
            quantity: current.node.quantity,
            title: current.node.title,
            variantId: variant ? variant.id : '', //consider null variant case
            productImageUrl: variant ? variant.image.url : 'img/item-unavalaible.png', //consider null variant case
            price: variant ? {
                  amount: variant.priceV2.amount,
                  currencyCode: variant.priceV2.currencyCode,
                } : {
                amount: "NO DISPONIBLE",
              currencyCode: "$",
              },
          };
          accum.push(orderLine);
          return accum;
        }, []);
      //debugger;
      return <CustomerOrderDetail>{
        order: order,
        lines: orderLines
      };
    }));
  }
}
