import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecountriesComponent } from './createcountries.component';

describe('CreatecountriesComponent', () => {
  let component: CreatecountriesComponent;
  let fixture: ComponentFixture<CreatecountriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatecountriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
