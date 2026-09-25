import { Routes } from '@angular/router';
import { BookList } from './books/book-list/book-list';
import { ReadersList } from './readers/readers-list/readers-list';
import { Login } from './auth/login/login';
import { authGuard } from './auth/auth.guard';
import { LoansList } from './loans/loans-list/loans-list';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: BookList, canActivate: [authGuard] },
  { path: 'readers', component: ReadersList, canActivate: [authGuard] },
  { path: 'loans', component: LoansList, canActivate: [authGuard] },
];