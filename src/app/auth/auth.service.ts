import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  readerId: number | null;
}

export type Role = 'ADMIN' | 'READER';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  readonly currentUser = signal<AuthUser | null>(this.readStoredUser());
  readonly isLoggedIn = signal(!!this.getToken());
  readonly role = computed(() => this.currentUser()?.role ?? null);
  readonly isAdmin = computed(() => this.role() === 'ADMIN');

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: AuthUser }>(
        `${this.apiUrl}/login`,
        { email, password },
      )
      .pipe(
        tap(({ token, user }) => {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          this.currentUser.set(user);
          this.isLoggedIn.set(true);
        }),
      );
  }

  hasRole(...roles: Role[]): boolean {
    return this.role() !== null && roles.includes(this.role()!);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.currentUser.set(null);
    this.isLoggedIn.set(false);

    this.router.navigateByUrl('/login');
  }

  private readStoredUser(): AuthUser | null {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      return null;
    }
  }
}