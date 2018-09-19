import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionInsightsComponent } from './region-insights.component';

describe('RegionInsightsComponent', () => {
  let component: RegionInsightsComponent;
  let fixture: ComponentFixture<RegionInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
