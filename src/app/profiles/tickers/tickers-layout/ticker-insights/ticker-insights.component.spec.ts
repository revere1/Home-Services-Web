import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerInsightsComponent } from './ticker-insights.component';

describe('TickerInsightsComponent', () => {
  let component: TickerInsightsComponent;
  let fixture: ComponentFixture<TickerInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TickerInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TickerInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
