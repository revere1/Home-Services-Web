import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystCompaniesUpdateComponent } from './analyst-companies-update.component';

describe('AnalystCompaniesUpdateComponent', () => {
  let component: AnalystCompaniesUpdateComponent;
  let fixture: ComponentFixture<AnalystCompaniesUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalystCompaniesUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystCompaniesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
