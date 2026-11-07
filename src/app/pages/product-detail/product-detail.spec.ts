import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ProductDetail } from './product-detail';
import { ShopifyService } from '../../commerce/shopify-service';
import { CartFacade } from '../../store/cart';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        { provide: ShopifyService, useValue: { getProductDetails: () => of({ title: 'Test product', imageUrl: 'https://example.com/test.jpg', description: 'Test description', price: 100, variantId: 'variant-1' }) } },
        { provide: CartFacade, useValue: { cartLines$: of([]), cartCheckoutUrl$: of(''), createCart: jasmine.createSpy('createCart'), addLineToCart: jasmine.createSpy('addLineToCart') } },
        { provide: ActivatedRoute, useValue: { queryParamMap: of(new Map([['id', '123']])) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a dialog when the product image is clicked', () => {
    component.product.set({
      id: '123',
      title: 'Test product',
      description: 'Test description',
      price: 100,
      imageUrl: 'https://example.com/test.jpg',
      variantId: 'variant-1',
      vendor: 'ACME',
      tags: [],
      isAvailable: true,
      productType: 'Test',
      handle: 'test-product',
      options: []
    });

    component.openProductImage();

    expect(dialog.open).toHaveBeenCalled();
    expect(dialog.open.calls.mostRecent().args[0].name).toBe('ProductImageDialog');
  });
});
