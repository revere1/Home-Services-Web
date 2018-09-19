import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsNewComponent } from './insights-new.component';

describe('InsightsNewComponent', () => {
  let component: InsightsNewComponent;
  let fixture: ComponentFixture<InsightsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
