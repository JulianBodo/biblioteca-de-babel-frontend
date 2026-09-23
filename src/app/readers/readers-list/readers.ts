import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { finalize, timeout } from 'rxjs';
import { Reader } from '../../shared/reader';
import { ReaderService } from '../../shared/services/reader-service';

@Component({
  selector: 'app-readers',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './readers.html',
  styleUrl: './readers.css',
})
export class Readers {
  readonly dataSource = signal<Reader[]>([]);
  readonly displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'dni',
    'status',
    'lastLoanAt',
    'actions',
  ];
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly busyIds = signal<ReadonlySet<number>>(new Set());

  constructor(private readonly readerService: ReaderService) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.readerService
      .getReaders()
      .pipe(
        timeout({ first: 15000 }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (readers) => this.dataSource.set(readers),
        error: () => this.errorMessage.set('No se pudieron cargar los lectores.'),
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

  suspend(reader: Reader): void {
    this.withBusy(reader.id, () => {
      this.readerService
        .suspendReader(reader.id)
        .pipe(finalize(() => this.clearBusy(reader.id)))
        .subscribe({
          next: (updated) => this.replace(updated),
          error: () => this.errorMessage.set(`No se pudo suspender a ${reader.firstName}.`),
        });
    });
  }

  reactivate(reader: Reader): void {
    this.withBusy(reader.id, () => {
      this.readerService
        .reactivateReader(reader.id)
        .pipe(finalize(() => this.clearBusy(reader.id)))
        .subscribe({
          next: (updated) => this.replace(updated),
          error: () => this.errorMessage.set(`No se pudo reactivar a ${reader.firstName}.`),
        });
    });
  }

  deleteReader(reader: Reader): void {
    const confirmed = window.confirm(`¿Eliminar a ${reader.firstName} ${reader.lastName}?`);
    if (!confirmed) return;

    this.withBusy(reader.id, () => {
      this.readerService
        .deleteReader(reader.id)
        .pipe(finalize(() => this.clearBusy(reader.id)))
        .subscribe({
          next: () =>
            this.dataSource.update((readers) => readers.filter((r) => r.id !== reader.id)),
          error: () => this.errorMessage.set(`No se pudo eliminar a ${reader.firstName}.`),
        });
    });
  }

  private replace(updated: Reader): void {
    this.dataSource.update((readers) => readers.map((r) => (r.id === updated.id ? updated : r)));
  }
}
