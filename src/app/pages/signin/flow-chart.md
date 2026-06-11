customerAccessTokenCreate
            │
            ▼
      Success ?
       /     \
     yes      no
      │        │
      ▼        ▼
 Store Token  UNIDENTIFIED_CUSTOMER
                   │
                   ▼
            createCustomer
               /      \
           TAKEN      Created
             │           │
             ▼           ▼
     Wrong Password   Retry Login
                             │
                             ▼
                   customerAccessTokenCreate
                             │
                             ▼
                        Store Token