import { TestBed, inject } from '@angular/core/testing';

import { ClientFormService } from './client-form.service';

describe('ClientFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientFormService]
    });
  });

  it('should be created', inject([ClientFormService], (service: ClientFormService) => {
    expect(service).toBeTruthy();
  }));
});
