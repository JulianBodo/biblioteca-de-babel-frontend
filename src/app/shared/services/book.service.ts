import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookInput } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly base = 'http://localhost:3000/api/books';

  constructor(private readonly http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.base);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.base}/${id}`);
  }

  createBook(input: BookInput): Observable<Book> {
    return this.http.post<Book>(this.base, input);
  }

  updateBook(id: number, changes: Partial<BookInput>): Observable<Book> {
    return this.http.put<Book>(`${this.base}/${id}`, changes);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
