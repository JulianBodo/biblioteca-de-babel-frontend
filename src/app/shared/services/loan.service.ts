import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { Loan, LoanCreate } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly apiUrl = 'http://localhost:3000/api/loans';

  constructor(private readonly httpClient: HttpClient) {}

  getLoans(): Observable<Loan[]> {
    return this.httpClient.get<Loan[]>(this.apiUrl);
  }

  getAvailableBooks(readerId: number): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/available?readerId=${readerId}`);
  }

  createLoan(input: LoanCreate): Observable<Loan> {
    return this.httpClient.post<Loan>(this.apiUrl, input);
  }

  deleteLoan(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  approve(id: number): Observable<Loan> {
    return this.httpClient.patch<Loan>(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: number): Observable<Loan> {
    return this.httpClient.patch<Loan>(`${this.apiUrl}/${id}/reject`, {});
  }

  returnLoan(id: number): Observable<Loan> {
    return this.httpClient.patch<Loan>(`${this.apiUrl}/${id}/return`, {});
  }
  updateDueDate(id: number, dueDate: string): Observable<Loan> {
    return this.httpClient.patch<Loan>(`${this.apiUrl}/${id}/due-date`, { dueDate });
  }
}