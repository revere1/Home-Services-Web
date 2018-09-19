import { TestBed, inject } from '@angular/core/testing';

import { ComposeFormService } from './compose-form.service';

describe('ComposeFormService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ComposeFormService]
      });
    });
  
    it('should be created', inject([ComposeFormService], (service: ComposeFormService) => {
      expect(service).toBeTruthy();
    }));
  });