import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystCompaniesFormComponent } from './analyst-companies-form.component';

describe('AnalystCompaniesFormComponent', () => {
  let component: AnalystCompaniesFormComponent;
  let fixture: ComponentFixture<AnalystCompaniesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalystCompaniesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystCompaniesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
