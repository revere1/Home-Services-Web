import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsCommentsFormComponent } from './insights-comments-form.component';

describe('InsightsCommentsFormComponent', () => {
  let component: InsightsCommentsFormComponent;
  let fixture: ComponentFixture<InsightsCommentsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightsCommentsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightsCommentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
