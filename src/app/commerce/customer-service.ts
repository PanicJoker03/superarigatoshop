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
        phone : this.environment.isProduction ? phone : this.environment.customerCreationRequireds.fakePhone
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
}
