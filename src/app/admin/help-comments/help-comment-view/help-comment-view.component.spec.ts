import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCommentViewComponent } from './help-comment-view.component';

describe('HelpCommentViewComponent', () => {
  let component: HelpCommentViewComponent;
  let fixture: ComponentFixture<HelpCommentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpCommentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCommentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
