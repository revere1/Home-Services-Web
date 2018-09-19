import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightProvidersComponent } from './insight-providers.component';

describe('InsightProvidersComponent', () => {
  let component: InsightProvidersComponent;
  let fixture: ComponentFixture<InsightProvidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightProvidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
