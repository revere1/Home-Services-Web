import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystCompaniesListComponent } from './analyst-companies-list.component';

describe('AnalystCompaniesListComponent', () => {
  let component: AnalystCompaniesListComponent;
  let fixture: ComponentFixture<AnalystCompaniesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalystCompaniesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystCompaniesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
