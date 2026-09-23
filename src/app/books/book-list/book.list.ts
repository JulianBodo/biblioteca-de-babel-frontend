import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { Book } from '../../shared/models/book.model';
import { BookService } from '../../shared/services/book.services';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './book.list.html',
  styleUrl: './book.list.css',
})
export class BookList implements OnInit {
  readonly dataSource = signal<Book[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly displayedColumns = ['title', 'isbn', 'publicationYear', 'availableCopies'];

  constructor(
    private readonly bookService: BookService,
    private readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.auth.login('bibliotecario@babel.com', 'biblio123').subscribe({
      next: () => this.load(),
      error: () => this.errorMessage.set('No se pudo iniciar sesión.'),
    });
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.bookService
      .getBooks()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (books) => this.dataSource.set(books),
        error: () => this.errorMessage.set('No se pudieron cargar los libros.'),
      });
  }
}
