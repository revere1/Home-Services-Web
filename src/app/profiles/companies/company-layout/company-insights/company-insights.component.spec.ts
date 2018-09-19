import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInsightsComponent } from './company-insights.component';

describe('CompanyInsightsComponent', () => {
  let component: CompanyInsightsComponent;
  let fixture: ComponentFixture<CompanyInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
