import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize, forkJoin } from 'rxjs';
import { Author, Book, Genre, Publisher } from '../../shared/models/book.model';
import { BookService } from '../../shared/services/book.service';
import { CatalogService } from '../../shared/services/catalog.service';
import { apiErrorMessage } from '../../shared/utils/api-error';

export interface BookFormData {
  book?: Book;
}

@Component({
  selector: 'app-book-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly bookService = inject(BookService);
  private readonly catalogService = inject(CatalogService);
  private readonly dialogRef = inject<MatDialogRef<BookForm, Book>>(MatDialogRef);
  private readonly data = inject<BookFormData>(MAT_DIALOG_DATA);

  readonly editing = !!this.data.book;
  readonly loadingCatalogs = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly authors = signal<Author[]>([]);
  readonly genres = signal<Genre[]>([]);
  readonly publishers = signal<Publisher[]>([]);

  readonly form = this.formBuilder.nonNullable.group({
    title: [this.data.book?.title ?? '', [Validators.required]],
    isbn: [this.data.book?.isbn ?? '', [Validators.required]],
    publicationYear: [
      this.data.book?.publicationYear ?? new Date().getFullYear(),
      [Validators.required, Validators.min(1), Validators.max(new Date().getFullYear())],
    ],
    totalCopies: [this.data.book?.totalCopies ?? 1, [Validators.required, Validators.min(1)]],
    genreId: [this.data.book?.genreId ?? 0, [Validators.min(1)]],
    publisherId: [this.data.book?.publisherId ?? 0, [Validators.min(1)]],
    authorIds: [this.data.book?.authors.map((a) => a.id) ?? ([] as number[]), [Validators.required]],
  });

  ngOnInit(): void {
    forkJoin({
      authors: this.catalogService.getAuthors(),
      genres: this.catalogService.getGenres(),
      publishers: this.catalogService.getPublishers(),
    })
      .pipe(finalize(() => this.loadingCatalogs.set(false)))
      .subscribe({
        next: ({ authors, genres, publishers }) => {
          this.authors.set(authors);
          this.genres.set(genres);
          this.publishers.set(publishers);
        },
        error: (err) =>
          this.errorMessage.set(apiErrorMessage(err, 'No se pudieron cargar los catálogos.')),
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const value = this.form.getRawValue();
    const request = this.data.book
      ? this.bookService.updateBook(this.data.book.id, value)
      : this.bookService.createBook(value);

    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (book) => this.dialogRef.close(book),
      error: (err) =>
        this.errorMessage.set(apiErrorMessage(err, 'No se pudo guardar el libro.')),
    });
  }
}