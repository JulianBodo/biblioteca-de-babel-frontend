import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const message = error.error?.error;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }
  }
  return fallback;
}