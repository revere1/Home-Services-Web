import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsCommentsComponent } from './insights-comments.component';

describe('InsightsCommentsComponent', () => {
  let component: InsightsCommentsComponent;
  let fixture: ComponentFixture<InsightsCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightsCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
