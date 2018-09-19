import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionAboutComponent } from './region-about.component';

describe('RegionAboutComponent', () => {
  let component: RegionAboutComponent;
  let fixture: ComponentFixture<RegionAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
