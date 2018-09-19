import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatesComponent } from './update-states.component';

describe('UpdateStatesComponent', () => {
  let component: UpdateStatesComponent;
  let fixture: ComponentFixture<UpdateStatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateStatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
