import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightProvidersNewComponent } from './insight-providers-new.component';

describe('InsightProvidersNewComponent', () => {
  let component: InsightProvidersNewComponent;
  let fixture: ComponentFixture<InsightProvidersNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightProvidersNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightProvidersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
