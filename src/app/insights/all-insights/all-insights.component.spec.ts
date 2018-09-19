import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInsightsComponent } from './all-insights.component';

describe('AllInsightsComponent', () => {
  let component: AllInsightsComponent;
  let fixture: ComponentFixture<AllInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
