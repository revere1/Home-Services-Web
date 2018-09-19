import { TestBed, inject } from '@angular/core/testing';

import { StatesFormService } from './states-form.service';

describe('StatesFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatesFormService]
    });
  });

  it('should be created', inject([StatesFormService], (service: StatesFormService) => {
    expect(service).toBeTruthy();
  }));
});
