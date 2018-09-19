import { TestBed, inject } from '@angular/core/testing';

import { SubCategoryFormService } from './sub-category-form.service';

describe('SubCategoryFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubCategoryFormService]
    });
  });

  it('should be created', inject([SubCategoryFormService], (service: SubCategoryFormService) => {
    expect(service).toBeTruthy();
  }));
});
