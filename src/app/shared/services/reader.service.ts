import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Reader, ReaderCreate, ReaderUpdate } from '../models/reader.model';

@Injectable({
  providedIn: 'root',
})
export class ReaderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/readers';

  getReaders(status?: string): Observable<Reader[]> {
    const params = status
      ? new HttpParams().set('status', status)
      : undefined;

    return this.http.get<Reader[]>(this.apiUrl, { params });
  }

  getReader(id: number): Observable<Reader> {
    return this.http.get<Reader>(`${this.apiUrl}/${id}`);
  }

  createReader(input: ReaderCreate): Observable<Reader> {
    return this.http.post<Reader>(this.apiUrl, input);
  }

  updateReader(id: number, changes: ReaderUpdate): Observable<Reader> {
    return this.http.put<Reader>(`${this.apiUrl}/${id}`, changes);
  }

  suspendReader(id: number): Observable<Reader> {
    return this.http.patch<Reader>(`${this.apiUrl}/${id}/suspend`, {});
  }

  reactivateReader(id: number): Observable<Reader> {
    return this.http.patch<Reader>(`${this.apiUrl}/${id}/reactivate`, {});
  }

  deleteReader(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}