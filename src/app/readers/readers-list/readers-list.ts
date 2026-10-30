import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { AuthService } from '../../auth/auth.service';
import { Reader } from '../../shared/models/reader.model';
import { ReaderService } from '../../shared/services/reader.service';
import { apiErrorMessage } from '../../shared/utils/api-error';
import { ReaderForm, ReaderFormData } from '../reader-form/reader-form';

@Component({
  selector: 'app-readers-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './readers-list.html',
  styleUrl: './readers-list.css',
})
export class ReadersList implements OnInit {
  private readonly readerService = inject(ReaderService);
  private readonly dialog = inject(MatDialog);
  private readonly auth = inject(AuthService);

  readonly isAdmin = this.auth.isAdmin;
  readonly dataSource = signal<Reader[]>([]);
  readonly displayedColumns = [
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

  ngOnInit(): void {
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
        next: readers => this.dataSource.set(readers),
        error: err => {
          this.errorMessage.set(
            apiErrorMessage(err, 'No se pudieron cargar los lectores.'),
          );
        },
      });
  }

  create(): void {
    this.openForm({}).subscribe(saved => {
      if (saved) {
        this.dataSource.update(readers => [...readers, saved]);
      }
    });
  }

  edit(reader: Reader): void {
    this.openForm({ reader }).subscribe(saved => {
      if (saved) this.replace(saved);
    });
  }

  suspend(reader: Reader): void {
    this.updateReader(
      reader,
      () => this.readerService.suspendReader(reader.id),
      `No se pudo suspender a ${reader.firstName}.`,
    );
  }

  reactivate(reader: Reader): void {
    this.updateReader(
      reader,
      () => this.readerService.reactivateReader(reader.id),
      `No se pudo reactivar a ${reader.firstName}.`,
    );
  }

  deleteReader(reader: Reader): void {
    if (!window.confirm(`¿Eliminar a ${reader.firstName} ${reader.lastName}?`)) {
      return;
    }

    this.withBusy(reader.id, () => {
      this.readerService
        .deleteReader(reader.id)
        .pipe(finalize(() => this.clearBusy(reader.id)))
        .subscribe({
          next: () => {
            this.dataSource.update(readers =>
              readers.filter(item => item.id !== reader.id),
            );
          },
          error: err => {
            this.errorMessage.set(
              apiErrorMessage(err, `No se pudo eliminar a ${reader.firstName}.`),
            );
          },
        });
    });
  }

  private updateReader(
    reader: Reader,
    request: () => ReturnType<ReaderService['suspendReader']>,
    fallbackMessage: string,
  ): void {
    this.withBusy(reader.id, () => {
      request()
        .pipe(finalize(() => this.clearBusy(reader.id)))
        .subscribe({
          next: updated => this.replace(updated),
          error: err => {
            this.errorMessage.set(apiErrorMessage(err, fallbackMessage));
          },
        });
    });
  }

  private openForm(data: ReaderFormData) {
    return this.dialog
      .open<ReaderForm, ReaderFormData, Reader>(ReaderForm, {
        data,
        width: '560px',
        maxWidth: '95vw',
      })
      .afterClosed();
  }

  private withBusy(id: number, action: () => void): void {
    if (this.busyIds().has(id)) return;

    this.errorMessage.set('');
    this.busyIds.update(ids => new Set(ids).add(id));
    action();
  }

  private clearBusy(id: number): void {
    this.busyIds.update(ids => {
      const remaining = new Set(ids);
      remaining.delete(id);
      return remaining;
    });
  }

  private replace(updated: Reader): void {
    this.dataSource.update(readers =>
      readers.map(reader => reader.id === updated.id ? updated : reader),
    );
  }
}