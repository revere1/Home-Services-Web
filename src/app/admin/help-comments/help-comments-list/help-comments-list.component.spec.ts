import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCommentsListComponent } from './help-comments-list.component';

describe('HelpCommentsListComponent', () => {
  let component: HelpCommentsListComponent;
  let fixture: ComponentFixture<HelpCommentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpCommentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCommentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
