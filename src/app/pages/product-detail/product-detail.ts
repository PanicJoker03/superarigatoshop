import { Component, HostListener, inject, signal } from '@angular/core';
import { Product } from '../../components/product-grid-item/product.model';
import { ShopifyService } from '../../commerce/shopify-service';
// import { CartService } from '../../commerce/cart-service';
import { ActivatedRoute } from '@angular/router';
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { MatButtonToggle, MatButtonToggleGroup } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';
import { CartFacade } from '../../store/cart';
import { filter, take } from 'rxjs/operators';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-product-detail',
  imports: [MatCard, MatCardHeader, MatCardModule, MatButtonToggle, MatButtonToggleGroup, MatButtonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private shopifyService =  inject(ShopifyService);
  private cart = inject(CartFacade);
  private activateRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  product = signal<Product | null>(null);
  quantity = signal<number>(10);

  openProductImage(event?: MouseEvent) {
    event?.stopPropagation();
    this.openProductDialog();
  }

  openProductDescription(event?: MouseEvent) {
    event?.stopPropagation();
    this.openProductDialog();
  }

  private openProductDialog() {
    const imageUrl = this.product()?.imageUrl;
    if (!imageUrl) {
      return;
    }

    this.dialog.open(ProductImageDialog, {
      data: {
        imageUrl,
        title: this.product()?.title ?? 'Product image',
      },
      width: 'min(92vw, 1200px)',
      maxWidth: '92vw',
      maxHeight: '92vh',
      panelClass: 'product-image-dialog-panel',
      autoFocus: false,
      hasBackdrop: true,
      disableClose: false,
      backdropClass: 'product-image-dialog-backdrop',
      enterAnimationDuration: 200,
      exitAnimationDuration: 150,
    });
  }

  ngOnInit() {
    //fetch product details by id and set the product signal
    this.activateRoute.queryParamMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.shopifyService.getProductDetails(productId).subscribe(product => {
          console.log('Product details fetched from ShopifyService:', product);
          this.product.set(product);
        });
      }
      else{
        //todo: redirect to not found page
        console.error('Product ID not found in route parameters');
      }
    });
  }
  decreaseQuantity() {
    this.quantity.update(q => Math.max(10, q - 1));
    // throw new Error('Method not implemented.');
  }
  increaseQuantity() {
    this.quantity.update(q => q + 1);
    // throw new Error('Method not implemented.');
  }
  buy(){
    console.log("buying ... ");
    const currentProduct = this.product();
    if(currentProduct){
      //this.cart.(currentProduct, this.quantity());
      console.log("navigating to payment");
      // this.router.navigate(['/pages/payment']);

      const variantId = this.product()?.variantId;
      if (!variantId) {
        console.error('Product variant ID is missing');
        return;
      }

      //#begin# snippet to add product to card
      const cartId = localStorage.getItem('cartId');

      if(!cartId){
        console.log("no cart loaded");
        this.cart.createCart(variantId, this.quantity());
      }
      else{        
        console.log("cart loaded");
        this.cart.addLineToCart(cartId, variantId, this.quantity());
      }
      
      this.cart.cartLines$.pipe(take(1)).subscribe((cart:Array<{}>)=>{
        console.log(cart);
        //patch if empty then recreate cart 
        let cartValid = true;
        if(!cart) 
          cartValid = false;
        if(cartValid)
          if(cart.length == 0)
            cartValid = false;
        if(!cartValid)
          this.cart.createCart(variantId, this.quantity());
      });

      //rxjs to the rescue, wait till cart available
      this.cart.cartCheckoutUrl$.pipe(
        filter(url => !!url),
        take(1)
      ).subscribe((url)=>{
        console.log("url for payment", url);
        this.router.navigate(['/pages/payment']).finally(()=>{
          console.log("finally happened");
        });
        //window.location.href = url        
      });
      //#end# snippet to add product to card
    }
    else{
      console.error('No product selected to add to cart');
    }
  }
}

interface ProductImageDialogData {
  imageUrl: string;
  title: string;
}

@Component({
  selector: 'product-image-dialog',
  standalone: true,
  template: `
    <div mat-dialog-content class="product-image-dialog-content">
      <img [src]="data.imageUrl" [alt]="data.title" class="product-image-dialog-image" />
    </div>
    <div mat-dialog-actions align="end" class="product-image-dialog-actions">
      <button mat-flat-button color="primary" (click)="closeDialog()">Cerrar</button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: rgba(0, 0, 0, 0.78);
      border-radius: 18px;
      overflow: hidden;
    }

    .product-image-dialog-shell {
      cursor: pointer;
      background: rgba(0, 0, 0, 0.68);
      border-radius: 18px;
    }

    .product-image-dialog-content {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      margin: 0;
      background: rgba(0, 0, 0, 0.68);
      max-width: 92vw;
      max-height: 90vh;
      border-radius: 18px 18px 0 0;
    }

    .product-image-dialog-image {
      width: auto;
      max-width: min(88vw, 1100px);
      max-height: 85vh;
      object-fit: contain;
      display: block;
      border-radius: 12px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
    }

    .product-image-dialog-actions {
      padding: 0 20px 20px;
      background: rgba(0, 0, 0, 0.68);
      border-radius: 0 0 18px 18px;
    }
  `],
  imports: [MatDialogContent, MatDialogActions, MatButtonModule],
})
export class ProductImageDialog {
  readonly data = inject<ProductImageDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ProductImageDialog>);

  @HostListener('click')
  onHostClick(): void {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
