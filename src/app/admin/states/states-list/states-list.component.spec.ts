import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatesListComponent } from './states-list.component';

describe('StatesListComponent', () => {
  let component: StatesListComponent;
  let fixture: ComponentFixture<StatesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
