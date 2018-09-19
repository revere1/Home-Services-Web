import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersInsightsComponent } from './users-insights.component';

describe('UsersInsightsComponent', () => {
  let component: UsersInsightsComponent;
  let fixture: ComponentFixture<UsersInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
