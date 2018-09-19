import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubCategoryComponent } from './create-sub-category.component';

describe('CreateSubSectorComponent', () => {
  let component: CreateSubCategoryComponent;
  let fixture: ComponentFixture<CreateSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
