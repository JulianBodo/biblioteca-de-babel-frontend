import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly apiUrl = 'http://localhost:3000/api/loans';

  constructor(private readonly httpClient: HttpClient) {}

  getLoans(): Observable<Loan[]> {
    return this.httpClient.get<Loan[]>(this.apiUrl);
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
}