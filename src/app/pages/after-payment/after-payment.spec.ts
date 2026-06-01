import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterPayment } from './after-payment';

describe('AfterPayment', () => {
  let component: AfterPayment;
  let fixture: ComponentFixture<AfterPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfterPayment],
    }).compileComponents();

    fixture = TestBed.createComponent(AfterPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
