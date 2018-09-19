import { TestBed, inject } from '@angular/core/testing';

import { HelpFormService } from './help-form.service';

describe('HelpFormService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [HelpFormService]
      });
    });
  
    it('should be created', inject([HelpFormService], (service: HelpFormService) => {
      expect(service).toBeTruthy();
    }));
  });