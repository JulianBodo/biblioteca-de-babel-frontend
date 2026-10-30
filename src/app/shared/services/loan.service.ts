import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Book } from '../models/book.model';
import { Loan, LoanCreate } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/loans';

  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl);
  }

  getAvailableBooks(readerId: number): Observable<Book[]> {
    const params = new HttpParams().set('readerId', readerId);

    return this.http.get<Book[]>(`${this.apiUrl}/available`, { params });
  }

  createLoan(input: LoanCreate): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, input);
  }

  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  approve(id: number): Observable<Loan> {
    return this.http.patch<Loan>(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: number): Observable<Loan> {
    return this.http.patch<Loan>(`${this.apiUrl}/${id}/reject`, {});
  }

  returnLoan(id: number): Observable<Loan> {
    return this.http.patch<Loan>(`${this.apiUrl}/${id}/return`, {});
  }

  updateDueDate(id: number, dueDate: string): Observable<Loan> {
    return this.http.patch<Loan>(`${this.apiUrl}/${id}/due-date`, { dueDate });
  }
}