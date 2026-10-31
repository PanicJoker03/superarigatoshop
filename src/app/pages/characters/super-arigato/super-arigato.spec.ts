import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperArigato } from './super-arigato';

describe('SuperArigato', () => {
  let component: SuperArigato;
  let fixture: ComponentFixture<SuperArigato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperArigato],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperArigato);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
