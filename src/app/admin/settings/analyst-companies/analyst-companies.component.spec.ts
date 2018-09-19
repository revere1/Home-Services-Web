import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystCompaniesComponent } from './analyst-companies.component';

describe('AnalystCompaniesComponent', () => {
  let component: AnalystCompaniesComponent;
  let fixture: ComponentFixture<AnalystCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalystCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
