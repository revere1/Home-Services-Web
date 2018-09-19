import { TestBed, inject } from '@angular/core/testing';

import { LockerFormService } from './locker-form.service';

describe('HelpFormService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [LockerFormService]
      });
    });
  
    it('should be created', inject([LockerFormService], (service: LockerFormService) => {
      expect(service).toBeTruthy();
    }));
  });