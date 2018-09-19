import { TestBed, inject } from '@angular/core/testing';

import { MessagesFormService } from './messages-form.service';

describe('CountriesFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagesFormService]
    });
  });

  it('should be created', inject([MessagesFormService], (service: MessagesFormService) => {
    expect(service).toBeTruthy();
  }));
});
