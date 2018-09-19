import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsTrendingComponent } from './insights-trending.component';

describe('InsightsTrendingComponent', () => {
  let component: InsightsTrendingComponent;
  let fixture: ComponentFixture<InsightsTrendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightsTrendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightsTrendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
