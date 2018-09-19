import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorsAboutComponent } from './sectors-about.component';

describe('SectorsAboutComponent', () => {
  let component: SectorsAboutComponent;
  let fixture: ComponentFixture<SectorsAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorsAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorsAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
