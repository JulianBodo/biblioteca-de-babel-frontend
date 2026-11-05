import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanForm } from './loan-form';

describe('LoanForm', () => {
  let component: LoanForm;
  let fixture: ComponentFixture<LoanForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanForm],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: vi.fn() }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
