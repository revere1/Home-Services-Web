import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyLayoutComponent } from './currency-layout.component';

describe('CurrencyLayoutComponent', () => {
  let component: CurrencyLayoutComponent;
  let fixture: ComponentFixture<CurrencyLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
