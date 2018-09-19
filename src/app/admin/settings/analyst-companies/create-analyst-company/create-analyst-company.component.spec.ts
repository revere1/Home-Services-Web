import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnalystCompanyComponent } from './create-analyst-company.component';

describe('CreateAnalystCompanyComponent', () => {
  let component: CreateAnalystCompanyComponent;
  let fixture: ComponentFixture<CreateAnalystCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAnalystCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAnalystCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
