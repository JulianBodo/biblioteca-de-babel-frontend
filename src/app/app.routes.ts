import { Routes } from '@angular/router';
import { BookList } from './books/book-list/book-list';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => 
      import('./auth/login/login').then((m) => m.Login),
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./home/home').then((m) => m.Home),
    canActivate: [authGuard],
  },

  { 
    path: 'books', 
    loadComponent: () => import('./books/book-list/book-list').then((m) => m.BookList),
    canActivate: [authGuard],
  },

  {
    path: 'readers',
    loadComponent: () =>
      import('./readers/readers-list/readers-list').then((m) => m.ReadersList),
    canActivate: [roleGuard('ADMIN', 'LIBRARIAN')],
  },

  {
    path: 'loans',
    loadComponent: () => import('./loans/loans-list/loans-list').then((m) => m.LoansList),
    canActivate: [roleGuard('ADMIN', 'LIBRARIAN')],
  },
];