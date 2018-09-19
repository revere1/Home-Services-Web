import { TestBed, inject } from '@angular/core/testing';

import { CompanyFormService } from './company-form.service';

describe('CompanyFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyFormService]
    });
  });

  it('should be created', inject([CompanyFormService], (service: CompanyFormService) => {
    expect(service).toBeTruthy();
  }));
});
