import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightProvidersTrendingComponent } from './insight-providers-trending.component';

describe('InsightProvidersTrendingComponent', () => {
  let component: InsightProvidersTrendingComponent;
  let fixture: ComponentFixture<InsightProvidersTrendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightProvidersTrendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightProvidersTrendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
