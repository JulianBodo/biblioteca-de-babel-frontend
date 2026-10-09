import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Book } from '../../shared/models/book.model';
import { BookService } from '../../shared/services/book.service';
import { apiErrorMessage } from '../../shared/utils/api-error';
import { BookForm, BookFormData } from '../book-form/book-form';

@Component({
  selector: 'app-book-list',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(AuthService);

  /** Según el backend, solo ADMIN puede crear, editar y eliminar libros. */
  readonly canManage = this.auth.isAdmin;

  readonly dataSource = signal<Book[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly busyIds = signal<ReadonlySet<number>>(new Set());

  readonly displayedColumns = computed(() => {
    const columns = ['title', 'authors', 'genre', 'isbn', 'publicationYear', 'copies'];
    return this.canManage() ? [...columns, 'actions'] : columns;
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.bookService
      .getBooks()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (books) => this.dataSource.set(books),
        error: (err) =>
          this.errorMessage.set(apiErrorMessage(err, 'No se pudieron cargar los libros.')),
      });
  }

  authorsLabel(book: Book): string {
    return book.authors.map((a) => `${a.firstName} ${a.lastName}`).join(', ');
  }

  create(): void {
    this.openForm({}).subscribe((saved) => {
      if (saved) this.dataSource.update((books) => [...books, saved]);
    });
  }

  edit(book: Book): void {
    this.openForm({ book }).subscribe((saved) => {
      if (saved) {
        this.dataSource.update((books) => books.map((b) => (b.id === saved.id ? saved : b)));
      }
    });
  }

  remove(book: Book): void {
    if (!window.confirm(`¿Eliminar el libro "${book.title}"?`)) return;
    if (this.busyIds().has(book.id)) return;

    this.busyIds.update((ids) => new Set(ids).add(book.id));
    this.errorMessage.set('');

    this.bookService
      .deleteBook(book.id)
      .pipe(
        finalize(() =>
          this.busyIds.update((ids) => {
            const remaining = new Set(ids);
            remaining.delete(book.id);
            return remaining;
          }),
        ),
      )
      .subscribe({
        next: () => this.dataSource.update((books) => books.filter((b) => b.id !== book.id)),
        error: (err) =>
          this.errorMessage.set(apiErrorMessage(err, `No se pudo eliminar "${book.title}".`)),
      });
  }

  private openForm(data: BookFormData) {
    return this.dialog
      .open<BookForm, BookFormData, Book>(BookForm, { data, width: '640px', maxWidth: '95vw' })
      .afterClosed();
  }
}