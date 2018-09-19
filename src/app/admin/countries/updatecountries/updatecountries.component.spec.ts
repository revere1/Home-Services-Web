import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecountriesComponent } from './updatecountries.component';

describe('UpdatecountriesComponent', () => {
  let component: UpdatecountriesComponent;
  let fixture: ComponentFixture<UpdatecountriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatecountriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatecountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
