import { TestBed, inject } from '@angular/core/testing';

import { InsightcommentFormService } from './insightcomment-form.service';

describe('InsightcommentFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InsightcommentFormService]
    });
  });

  it('should be created', inject([InsightcommentFormService], (service: InsightcommentFormService) => {
    expect(service).toBeTruthy();
  }));
});
