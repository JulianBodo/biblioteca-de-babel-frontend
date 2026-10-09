import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  readerId: number | null;
}

export type Role = 'ADMIN' | 'LIBRARIAN' | 'READER';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<AuthUser | null>(this.readStoredUser());
  readonly isLoggedIn = signal<boolean>(!!this.getToken());
  readonly role = computed<Role | null>(() => this.currentUser()?.role ?? null);
  readonly isAdmin = computed(() => this.role() === 'ADMIN');
  readonly isStaff = computed(() => this.role() === 'ADMIN' || this.role() === 'LIBRARIAN');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: AuthUser }>(`http://localhost:3000/api/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
          this.isLoggedIn.set(true);
        }),
      );
  }
  
  hasRole(...roles: Role[]): boolean {
    const current = this.role();
    return current !== null && roles.includes(current);
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
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }
}