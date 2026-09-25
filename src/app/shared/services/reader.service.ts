import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reader, ReaderUpdate } from '../models/reader.model';

@Injectable({
  providedIn: 'root',
})
export class ReaderService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private readonly httpClient: HttpClient) {}

  getReaders(status?: string): Observable<Reader[]> {
    const url = status ? `${this.apiUrl}/readers?status=${status}` : `${this.apiUrl}/readers`;
    return this.httpClient.get<Reader[]>(url);
  }

  getReader(id: number): Observable<Reader> {
    return this.httpClient.get<Reader>(`${this.apiUrl}/readers/${id}`);
  }

  updateReader(id: number, changes: ReaderUpdate): Observable<Reader> {
    return this.httpClient.put<Reader>(`${this.apiUrl}/readers/${id}`, changes);
  }

  suspendReader(id: number): Observable<Reader> {
    return this.httpClient.patch<Reader>(`${this.apiUrl}/readers/${id}/suspend`, {});
  }

  reactivateReader(id: number): Observable<Reader> {
    return this.httpClient.patch<Reader>(`${this.apiUrl}/readers/${id}/reactivate`, {});
  }

  deleteReader(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/readers/${id}`);
  }
}
