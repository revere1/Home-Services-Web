import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerFormComponent } from './locker-form.component';

describe('LockerFormComponent', () => {
  let component: LockerFormComponent;
  let fixture: ComponentFixture<LockerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
