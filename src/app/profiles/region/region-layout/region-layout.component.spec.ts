import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionLayoutComponent } from './region-layout.component';

describe('RegionLayoutComponent', () => {
  let component: RegionLayoutComponent;
  let fixture: ComponentFixture<RegionLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
