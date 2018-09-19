import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyAboutComponent } from './currency-about.component';

describe('CurrencyAboutComponent', () => {
  let component: CurrencyAboutComponent;
  let fixture: ComponentFixture<CurrencyAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
