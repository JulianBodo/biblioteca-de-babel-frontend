import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { Book } from '../../shared/models/book.model';
import { Loan } from '../../shared/models/loan.model';
import { Reader } from '../../shared/models/reader.model';
import { LoanService } from '../../shared/services/loan.service';
import { ReaderService } from '../../shared/services/reader.service';
import { apiErrorMessage } from '../../shared/utils/api-error';

export interface LoanFormData {
  loan?: Loan;
}

@Component({
  selector: 'app-loan-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './loan-form.html',
  styleUrl: './loan-form.css',
})
export class LoanForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly loanService = inject(LoanService);
  private readonly readerService = inject(ReaderService);
  private readonly dialogRef = inject<MatDialogRef<LoanForm, Loan>>(MatDialogRef);
  private readonly data = inject<LoanFormData>(MAT_DIALOG_DATA);

  readonly editing = !!this.data.loan;
  readonly summary = this.data.loan
    ? `"${this.data.loan.book.title}" — ${this.data.loan.reader.firstName} ${this.data.loan.reader.lastName}`
    : '';
  readonly loadingReaders = signal(false);
  readonly loadingBooks = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly readers = signal<Reader[]>([]);
  readonly books = signal<Book[]>([]);

  readonly createForm = this.formBuilder.nonNullable.group({
    readerId: [0, [Validators.min(1)]],
    bookId: [{ value: 0, disabled: true }, [Validators.min(1)]],
  });

  readonly editForm = this.formBuilder.nonNullable.group({
    dueDate: [this.toDateInput(this.data.loan?.dueDate), [Validators.required]],
  });

  ngOnInit(): void {
    if (this.editing) return;

    this.loadingReaders.set(true);
    this.readerService
      .getReaders('ACTIVE')
      .pipe(finalize(() => this.loadingReaders.set(false)))
      .subscribe({
        next: (readers) => this.readers.set(readers),
        error: (err) =>
          this.errorMessage.set(apiErrorMessage(err, 'No se pudieron cargar los lectores.')),
      });

    this.createForm.controls.readerId.valueChanges.subscribe((readerId) => this.loadBooks(readerId));
  }

  private loadBooks(readerId: number): void {
    const bookControl = this.createForm.controls.bookId;
    bookControl.reset(0);
    bookControl.disable();
    this.books.set([]);

    if (!readerId) return;

    this.loadingBooks.set(true);
    this.loanService
      .getAvailableBooks(readerId)
      .pipe(finalize(() => this.loadingBooks.set(false)))
      .subscribe({
        next: (books) => {
          this.books.set(books);
          bookControl.enable();
        },
        error: (err) =>
          this.errorMessage.set(apiErrorMessage(err, 'No se pudieron cargar los libros.')),
      });
  }

  submit(): void {
    this.errorMessage.set('');

    if (this.data.loan) {
      this.submitEdit(this.data.loan);
    } else {
      this.submitCreate();
    }
  }

  private submitCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const { readerId, bookId } = this.createForm.getRawValue();
    this.finish(this.loanService.createLoan({ readerId, bookId }), 'No se pudo crear el préstamo.');
  }

  private submitEdit(loan: Loan): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const { dueDate } = this.editForm.getRawValue();
    this.finish(
      this.loanService.updateDueDate(loan.id, dueDate),
      'No se pudo actualizar el vencimiento.',
    );
  }

  private finish(request: ReturnType<LoanService['createLoan']>, fallback: string): void {
    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (loan) => this.dialogRef.close(loan),
      error: (err) => this.errorMessage.set(apiErrorMessage(err, fallback)),
    });
  }

  private toDateInput(value: string | null | undefined): string {
    return value ? value.slice(0, 10) : '';
  }
}