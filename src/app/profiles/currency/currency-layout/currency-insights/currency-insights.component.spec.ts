import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyInsightsComponent } from './currency-insights.component';

describe('CurrencyInsightsComponent', () => {
  let component: CurrencyInsightsComponent;
  let fixture: ComponentFixture<CurrencyInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
