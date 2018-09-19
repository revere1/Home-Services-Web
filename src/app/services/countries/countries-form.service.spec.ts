import { TestBed, inject } from '@angular/core/testing';

import { CountriesFormService } from './countries-form.service';

describe('CountriesFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountriesFormService]
    });
  });

  it('should be created', inject([CountriesFormService], (service: CountriesFormService) => {
    expect(service).toBeTruthy();
  }));
});
