import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyExpenseComponent } from './company-expense.component';

describe('CompanyExpenseComponent', () => {
  let component: CompanyExpenseComponent;
  let fixture: ComponentFixture<CompanyExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
