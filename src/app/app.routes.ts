import { Routes } from '@angular/router';
import { BookList } from './books/book-list/book-list';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  { path: '', component: BookList, canActivate: [authGuard] },
  {
    path: 'readers',
    loadComponent: () =>
      import('./readers/readers-list/readers-list').then(m => m.ReadersList),
    canActivate: [authGuard]
  },
  {
    path: 'loans',
    loadComponent: () =>
      import('./loans/loans-list/loans-list').then((m) => m.LoansList),
    canActivate: [authGuard],
  },
];