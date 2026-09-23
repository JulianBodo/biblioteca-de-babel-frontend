import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookList } from './books/book-list/book.list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BookList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('biblioteca-de-babel-frontend');
}
