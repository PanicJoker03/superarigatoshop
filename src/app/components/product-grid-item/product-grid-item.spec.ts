import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGridItem } from './product-grid-item';

describe('ProductGridItem', () => {
  let component: ProductGridItem;
  let fixture: ComponentFixture<ProductGridItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGridItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductGridItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
