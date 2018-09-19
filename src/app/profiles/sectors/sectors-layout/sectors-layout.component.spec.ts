import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorsLayoutComponent } from './sectors-layout.component';

describe('SectorsLayoutComponent', () => {
  let component: SectorsLayoutComponent;
  let fixture: ComponentFixture<SectorsLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorsLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
