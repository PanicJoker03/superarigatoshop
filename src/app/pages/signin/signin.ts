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
import { filter, merge, take } from 'rxjs';
import { CartLine } from '../../commerce/cart-service';
import { isPlatformBrowser } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../commerce/customer-service';

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

  constructor(private customer:CustomerService){
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

    const credentials = {
      email : this.emailControl.value!,
      password : this.passwordControl.value!,
      phone : this.phoneControl.value!
    };

    //validate forms
    const formCaptureValid = 
      this.emailControl.valid &&
      this.passwordControl.valid && 
      this.phoneControl.valid;

    if(formCaptureValid){
      console.log("Sign in with credentials:", credentials);
      this.customer.createCustomer(
        credentials.email, credentials.password, credentials.phone).subscribe(()=>{
        console.log('...');
      });
    }
    //#end# 
  }
}

