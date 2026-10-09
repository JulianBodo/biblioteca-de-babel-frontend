import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { Reader } from '../../shared/models/reader.model';
import { ReaderService } from '../../shared/services/reader.service';
import { apiErrorMessage } from '../../shared/utils/api-error';

export interface ReaderFormData {
  reader?: Reader;
}

@Component({
  selector: 'app-reader-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './reader-form.html',
  styleUrl: './reader-form.css',
})
export class ReaderForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly readerService = inject(ReaderService);
  private readonly dialogRef = inject<MatDialogRef<ReaderForm, Reader>>(MatDialogRef);
  private readonly data = inject<ReaderFormData>(MAT_DIALOG_DATA);

  readonly editing = !!this.data.reader;
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    firstName: [this.data.reader?.firstName ?? '', [Validators.required]],
    lastName: [this.data.reader?.lastName ?? '', [Validators.required]],
    email: [this.data.reader?.email ?? '', [Validators.required, Validators.email]],
    dni: [this.data.reader?.dni ?? '', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const value = this.form.getRawValue();
    const request = this.data.reader
      ? this.readerService.updateReader(this.data.reader.id, value)
      : this.readerService.createReader(value);

    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (reader) => this.dialogRef.close(reader),
      error: (err) =>
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo guardar el lector.')),
    });
  }
}