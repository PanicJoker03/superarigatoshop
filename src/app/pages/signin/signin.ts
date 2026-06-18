import { afterNextRender, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Product } from '../../components/product-grid-item/product.model';
import { ShopifyService } from '../../commerce/shopify-service';
import { CartFacade } from '../../store/cart';
import { ActivatedRoute } from '@angular/router';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule} from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field";
import { Router } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import { EMPTY, filter, firstValueFrom, merge, of, retry, switchMap, take, tap, throwError } from 'rxjs';
import { CartLine } from '../../commerce/cart-service';
import { isPlatformBrowser } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService, CustomerCreateResponse, CustomerAccessTokenCreateResponse, CustomerUserError } from '../../commerce/customer-service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'app-signin',  
  imports: [MatCard, MatCardHeader, MatCardModule, MatButtonModule, 
    MatListModule, MatInputModule, MatFormFieldModule, 
    FormsModule, ReactiveFormsModule, MatIconModule ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class Signin {
  //forms validation meta setup
  readonly emailControl = new FormControl('', 
    [
      Validators.required, 
      Validators.email
    ]);
  readonly passwordControl = new FormControl('', 
    [
      Validators.required, 
      Validators.minLength(8)
    ]);

  readonly phoneControl = new FormControl('',
    [
      Validators.required,
      Validators.minLength(10)
    ]);

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');
  phoneErrorMessage = signal('');
  hidePassword = signal(true);

  customer = inject(CustomerService);
  dialog = inject(MatDialog);
  router = inject(Router);

  constructor(){
    merge(this.emailControl.statusChanges, this.emailControl.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(()=> this.updateEmailErrorMessage());

    merge(this.passwordControl.statusChanges, this.passwordControl.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(()=> this.updatePasswordErrorMessage())
  }

  updateEmailErrorMessage() {
    if(this.emailControl.hasError('required')) {
      this.emailErrorMessage.set('Ingresa dato por favor');
    }
    else if (this.emailControl.hasError('email')) {
      this.emailErrorMessage.set('Correo no válido');
    }
    else{
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage(){
    if(this.passwordControl.hasError('required')){
      this.passwordErrorMessage.set('Ingresa dato por favor');
    }
    else if (this.passwordControl.hasError('minlength')){
      this.passwordErrorMessage.set('Captura al menos 8 caracteres');
    }
    else{
      this.passwordErrorMessage.set('');
    }
  }

  updatePhoneErrorMessage(){
    if(this.phoneControl.hasError('required')){
      this.phoneErrorMessage.set('Ingresa dato por favor');
    }
    else if (this.phoneControl.hasError('minlength')) {
      this.phoneErrorMessage.set('Captura al menos 10 dígitos');
    }
    else {
      this.phoneErrorMessage.set('');
    }
  }

  passwordToggleClickEvent(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  //test sign in
  signin(){
    //#begin# create customer

    this.updateEmailErrorMessage();
    this.updatePasswordErrorMessage();
    this.updatePhoneErrorMessage();

    //validate forms
    const formCaptureValid = 
      this.emailControl.valid &&
      this.passwordControl.valid && 
      this.phoneControl.valid;

    if(formCaptureValid){
      //under construction, move to customer service
      
      //test access token . . . . 

      //mini validation if phone not starts with +52, prepend it
      if(!this.phoneControl.value?.includes("+52")){
        const phoneVal = this.phoneControl.value; 
        this.phoneControl.setValue(`+52${phoneVal}`);
      }
      
      const credentials = {
        email : this.emailControl.value!,
        password : this.passwordControl.value!,
        phone : 
          this.phoneControl.value!.trim()
            .replaceAll(" ", '')
            .replaceAll("-", '')
      };


      //lcng: please, take a look to ./flow-chart.md to
      //understand how this login method proceeds
      this.customer.customerAccessTokenCreate(credentials.email, credentials.password)
        .pipe(
          switchMap((response: CustomerAccessTokenCreateResponse) => {
            if (response.data.customerAccessTokenCreate.customerUserErrors.length === 0) {
              return of(response);
              }
                //all ok ... 
                //user not exists or something else... try to create account
                console.log("user not exists or something else... try to create account");
                console.log(response);
              return this.customer.createCustomer(
                credentials.email, 
                credentials.password, 
                credentials.phone)
                .pipe(
                  switchMap((createResponse:CustomerCreateResponse)=>{
                    console.log('user creation attempt response:', createResponse);
                    if(createResponse.data.customerCreate.customerUserErrors.length>0){
                      let errMessage = createResponse.data.customerCreate.customerUserErrors[0].message
                      //code -> TAKEN
                      const emailTaken = 
                        createResponse.data.customerCreate.customerUserErrors
                        .some(err=> err.code == 'TAKEN');
                      if(emailTaken){
                        errMessage = 'Wrong password';
                      }
                      this.dialog.open(DialogErrorSignIn, {
                                      data: {
                                        message: errMessage
                                      }
                                    });
                                    return EMPTY;
                    }
                    console.log("User created successfully, retrying login...");
                    return this.customer.customerAccessTokenCreate(
                      credentials.email,
                      credentials.password
                    );
                  }));
          }))
        .subscribe((response: CustomerAccessTokenCreateResponse) => {
          console.log(response);
          if(response.data.customerAccessTokenCreate.customerUserErrors.length == 0 &&
            response.data.customerAccessTokenCreate.customerAccessToken.accessToken
          ){
          console.log('access token retrieved succesfully');
          //all ok ... store access token on local storage
            const accessToken = 
              response
              .data
              .customerAccessTokenCreate
              .customerAccessToken
              .accessToken;
            
            localStorage.setItem("customerAccessToken", accessToken);

            //redirect to home ... 
            this.router.navigate(['/']);

          }
        else {
          console.log('problem generating token');
        }
      });

      //test create

      //mock data
      const fake_1 = {
        email: "7m4gn@web-library.net",
        firstName:"Aegis",
        id:"gid://shopify/Customer/9486998110384",
        lastName:"Hyper",
        password : "HiZqFuDvDdQ7",
        phone:"+64213444049"
      }

      const fake_2 = {
        email: "bw1dj@web-library.net",
        firstName:"Aegis",
        id:"gid://shopify/Customer/9486998110384",
        lastName:"Hyper",
        password : "HiZqFuDvDdQ7",
        phone:"+64213444041"
      }
      
      const fake_3 = {
        email: "rh3it@web-library.net",
        firstName:"Aegis",
        id:"gid://shopify/Customer/9486998110384",
        lastName:"Hyper",
        password : "HiZqFuDvDdQ7",
        phone:"+64213444042"
      }

      //riotv@web-library.net
      const fake_4 = {
        email: "riotv@web-library.net",
        firstName:"Aegis",
        id:"gid://shopify/Customer/9486998110384",
        lastName:"Hyper",
        password : "HiZqFuDvDdQ7",
        phone:"+64213444042"
      }
      //7hy1r@web-library.net
      const fake_5 = {
        email: "7hy1r@web-library.net",
        firstName:"Aegis",
        id:"gid://shopify/Customer/9486998110384",
        lastName:"Hyper",
        password : "HiZqFuDvDdQ7",
        phone:"+64213444052"
      }

    }
    //#end# 
  }
}

//dialog component
interface DialogData {
  message : string
};
//create component for dialog to bind this.dialog.open
@Component({
  selector: 'dialog-error-sign-in',
  templateUrl: 'dialog-error-sign-in.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogErrorSignIn {
  readonly dialogRef = inject(MatDialogRef<DialogErrorSignIn>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onOk(){
    this.dialogRef.close();
  }
}