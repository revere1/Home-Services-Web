import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCommentsFormComponent } from './help-comments-form.component';

describe('HelpCommentsFormComponent', () => {
  let component: HelpCommentsFormComponent;
  let fixture: ComponentFixture<HelpCommentsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpCommentsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCommentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
