import { TestBed, inject } from '@angular/core/testing';
import { ContactUsFormService } from './contact-us-form.service';



describe('ContactUsFormService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ContactUsFormService]
      });
    });
  
    it('should be created', inject([ContactUsFormService], (service: ContactUsFormService) => {
      expect(service).toBeTruthy();
    }));
  });