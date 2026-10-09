import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author, Genre, Publisher } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly api = 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) {}

  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.api}/authors`);
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.api}/genres`);
  }

  getPublishers(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(`${this.api}/publishers`);
  }
}