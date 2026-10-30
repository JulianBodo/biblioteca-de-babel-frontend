import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { AuthService } from '../../auth/auth.service';
import { Book } from '../../shared/models/book.model';
import { BookService } from '../../shared/services/book.service';
import { LoanService } from '../../shared/services/loan.service';
import { apiErrorMessage } from '../../shared/utils/api-error';
import { BookForm, BookFormData } from '../book-form/book-form';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly loanService = inject(LoanService);
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(AuthService);

  readonly canManage = this.auth.isAdmin;
  readonly canRequestLoan = computed(() => this.auth.hasRole('READER'));

  readonly dataSource = signal<Book[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly busyIds = signal<ReadonlySet<number>>(new Set());
  readonly requestingIds = signal<ReadonlySet<number>>(new Set());

  readonly displayedColumns = computed(() => {
    const columns = [
      'title',
      'authors',
      'genre',
      'isbn',
      'publicationYear',
      'copies',
    ];

    return this.canManage() || this.canRequestLoan()
      ? [...columns, 'actions']
      : columns;
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
          this.errorMessage.set(
            apiErrorMessage(err, 'No se pudieron cargar los libros.'),
          ),
      });
  }

  authorsLabel(book: Book): string {
    return book.authors
      .map((author) => `${author.firstName} ${author.lastName}`)
      .join(', ');
  }

  create(): void {
    this.openForm({}).subscribe((saved) => {
      if (saved) {
        this.dataSource.update((books) => [...books, saved]);
      }
    });
  }

  edit(book: Book): void {
    this.openForm({ book }).subscribe((saved) => {
      if (saved) {
        this.dataSource.update((books) =>
          books.map((item) => (item.id === saved.id ? saved : item)),
        );
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
        finalize(() => {
          this.busyIds.update((ids) => {
            const remaining = new Set(ids);
            remaining.delete(book.id);
            return remaining;
          });
        }),
      )
      .subscribe({
        next: () => {
          this.dataSource.update((books) =>
            books.filter((item) => item.id !== book.id),
          );
        },
        error: (err) => {
          this.errorMessage.set(
            apiErrorMessage(err, `No se pudo eliminar "${book.title}".`),
          );
        },
      });
  }

  requestLoan(book: Book): void {
    if (this.requestingIds().has(book.id)) return;

    const confirmed = window.confirm(
      `¿Estás seguro de que querés solicitar el préstamo del libro "${book.title}"?`,
    );

    if (!confirmed) return;

    this.errorMessage.set('');
    this.successMessage.set('');

    this.requestingIds.update((ids) => new Set(ids).add(book.id));

    this.loanService
      .createLoan({ bookId: book.id })
      .pipe(
        finalize(() => {
          this.requestingIds.update((ids) => {
            const remaining = new Set(ids);
            remaining.delete(book.id);
            return remaining;
          });
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage.set(
            `Solicitud de préstamo enviada para "${book.title}".`,
          );
        },
        error: (err) => {
          this.errorMessage.set(
            apiErrorMessage(err, 'No se pudo solicitar el préstamo.'),
          );
        },
      });
  }

  private openForm(data: BookFormData) {
    return this.dialog
      .open<BookForm, BookFormData, Book>(BookForm, {
        data,
        width: '640px',
        maxWidth: '95vw',
      })
      .afterClosed();
  }
}