import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { Loan } from '../../shared/models/loan.model';
import { LoanService } from '../../shared/services/loan.service';

@Component({
  selector: 'app-loans-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './loans-list.html',
  styleUrl: './loans-list.css',
})
export class LoansList {
  private readonly loanService = inject(LoanService);

  readonly dataSource = signal<Loan[]>([]);
  readonly displayedColumns = ['id', 'reader', 'book', 'status', 'dueDate', 'mora', 'actions'];
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly busyIds = signal<ReadonlySet<number>>(new Set());

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.loanService
      .getLoans()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (loans) => this.dataSource.set(loans),
        error: () => this.errorMessage.set('No se pudieron cargar los préstamos.'),
      });
  }

  private withBusy(id: number, action: () => void): void {
    if (this.busyIds().has(id)) return;
    this.busyIds.update((ids) => new Set(ids).add(id));
    action();
  }

  private clearBusy(id: number): void {
    this.busyIds.update((ids) => {
      const remaining = new Set(ids);
      remaining.delete(id);
      return remaining;
    });
  }

  private replace(updated: Loan): void {
    this.dataSource.update((loans) => loans.map((l) => (l.id === updated.id ? updated : l)));
  }

  approve(loan: Loan): void {
    this.withBusy(loan.id, () => {
      this.loanService
        .approve(loan.id)
        .pipe(finalize(() => this.clearBusy(loan.id)))
        .subscribe({
          next: (updated) => this.replace(updated),
          error: () => this.errorMessage.set(`No se pudo aprobar el préstamo #${loan.id}.`),
        });
    });
  }

  reject(loan: Loan): void {
    this.withBusy(loan.id, () => {
      this.loanService
        .reject(loan.id)
        .pipe(finalize(() => this.clearBusy(loan.id)))
        .subscribe({
          next: (updated) => this.replace(updated),
          error: () => this.errorMessage.set(`No se pudo rechazar el préstamo #${loan.id}.`),
        });
    });
  }

  returnLoan(loan: Loan): void {
    this.withBusy(loan.id, () => {
      this.loanService
        .returnLoan(loan.id)
        .pipe(finalize(() => this.clearBusy(loan.id)))
        .subscribe({
          next: (updated) => this.replace(updated),
          error: () =>
            this.errorMessage.set(`No se pudo registrar la devolución del préstamo #${loan.id}.`),
        });
    });
  }
}