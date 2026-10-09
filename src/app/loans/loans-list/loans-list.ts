import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Loan } from '../../shared/models/loan.model';
import { LoanService } from '../../shared/services/loan.service';
import { apiErrorMessage } from '../../shared/utils/api-error';
import { LoanForm, LoanFormData } from '../loan-form/loan-form';

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
    RouterLink,
  ],
  templateUrl: './loans-list.html',
  styleUrl: './loans-list.css',
})
export class LoansList implements OnInit {
  private readonly loanService = inject(LoanService);
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(AuthService);

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
        error: (err) =>
          this.errorMessage.set(apiErrorMessage(err, 'No se pudieron cargar los préstamos.')),
      });
  }

  canEdit(loan: Loan): boolean {
    return loan.status === 'ACTIVE';
  }

  canDelete(loan: Loan): boolean {
    if (loan.status === 'PENDING') return true;
    if (loan.status === 'RETURNED' || loan.status === 'REJECTED') return this.auth.isAdmin();
    return false;
  }

  create(): void {
    this.openForm({}).subscribe((saved) => {
      if (saved) this.dataSource.update((loans) => [saved, ...loans]);
    });
  }

  edit(loan: Loan): void {
    this.openForm({ loan }).subscribe((saved) => {
      if (saved) this.replace(saved);
    });
  }

  approve(loan: Loan): void {
    this.run(loan, this.loanService.approve(loan.id), `No se pudo aprobar el préstamo #${loan.id}.`);
  }

  reject(loan: Loan): void {
    this.run(loan, this.loanService.reject(loan.id), `No se pudo rechazar el préstamo #${loan.id}.`);
  }

  returnLoan(loan: Loan): void {
    this.run(
      loan,
      this.loanService.returnLoan(loan.id),
      `No se pudo registrar la devolución del préstamo #${loan.id}.`,
    );
  }

  remove(loan: Loan): void {
    if (!window.confirm(`¿Eliminar el préstamo #${loan.id} de "${loan.book.title}"?`)) return;

    this.withBusy(loan.id, () => {
      this.loanService
        .deleteLoan(loan.id)
        .pipe(finalize(() => this.clearBusy(loan.id)))
        .subscribe({
          next: () => this.dataSource.update((loans) => loans.filter((l) => l.id !== loan.id)),
          error: (err) =>
            this.errorMessage.set(
              apiErrorMessage(err, `No se pudo eliminar el préstamo #${loan.id}.`),
            ),
        });
    });
  }

  private run(loan: Loan, request: ReturnType<LoanService['approve']>, fallback: string): void {
    this.withBusy(loan.id, () => {
      request.pipe(finalize(() => this.clearBusy(loan.id))).subscribe({
        next: (updated) => this.replace(updated),
        error: (err) => this.errorMessage.set(apiErrorMessage(err, fallback)),
      });
    });
  }

  private openForm(data: LoanFormData) {
    return this.dialog
      .open<LoanForm, LoanFormData, Loan>(LoanForm, { data, width: '560px', maxWidth: '95vw' })
      .afterClosed();
  }

  private withBusy(id: number, action: () => void): void {
    if (this.busyIds().has(id)) return;
    this.errorMessage.set('');
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
}