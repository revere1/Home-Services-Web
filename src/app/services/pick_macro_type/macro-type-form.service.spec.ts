import { TestBed, inject } from '@angular/core/testing';
import { MacroTypeFormService } from './macro-type-form-service';


describe('CountriesFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MacroTypeFormService]
    });
  });

  it('should be created', inject([MacroTypeFormService], (service: MacroTypeFormService) => {
    expect(service).toBeTruthy();
  }));
});
