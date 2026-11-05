import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookForm } from './book-form';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('BookForm', () => {
  let component: BookForm;
  let fixture: ComponentFixture<BookForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookForm],
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

    fixture = TestBed.createComponent(BookForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
