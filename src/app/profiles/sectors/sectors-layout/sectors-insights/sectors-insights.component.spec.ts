import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorsInsightsComponent } from './sectors-insights.component';

describe('SectorsInsightsComponent', () => {
  let component: SectorsInsightsComponent;
  let fixture: ComponentFixture<SectorsInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorsInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorsInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
