import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSectorListComponent } from './sub-category-list.component';

describe('SubSectorListComponent', () => {
  let component: SubSectorListComponent;
  let fixture: ComponentFixture<SubSectorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSectorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSectorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
