import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReaderForm } from './reader-form';

describe('ReaderForm', () => {
  let component: ReaderForm;
  let fixture: ComponentFixture<ReaderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReaderForm],
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

    fixture = TestBed.createComponent(ReaderForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
