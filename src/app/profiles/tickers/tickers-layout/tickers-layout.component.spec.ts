import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TickersLayoutComponent } from './tickers-layout.component';

describe('TickersLayoutComponent', () => {
  let component: TickersLayoutComponent;
  let fixture: ComponentFixture<TickersLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TickersLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TickersLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
