import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMobile } from './navigation-mobile';

describe('NavigationMobile', () => {
  let component: NavigationMobile;
  let fixture: ComponentFixture<NavigationMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationMobile],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationMobile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
