import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Author, Genre, Publisher } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.apiUrl}/authors`);
  }

  createAuthor(data: Pick<Author, 'firstName' | 'lastName'>): Observable<Author> {
    return this.http.post<Author>(`${this.apiUrl}/authors`, data);
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.apiUrl}/genres`);
  }

  getPublishers(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(`${this.apiUrl}/publishers`);
  }

  createPublisher(data: Pick<Publisher, 'name'>): Observable<Publisher> {
    return this.http.post<Publisher>(`${this.apiUrl}/publishers`, data);
  }
}