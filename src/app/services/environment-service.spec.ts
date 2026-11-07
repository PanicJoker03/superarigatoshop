import { TestBed } from '@angular/core/testing';

import { EnvironmentService } from './environment-service';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose the configured WhatsApp phone number', () => {
    expect(service.whatsappPhoneNumber).toBe('528772017955');
  });
});
