import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookList } from './books/book-list/book-list';
import { ReadersList } from './readers/readers-list/readers-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('biblioteca-de-babel-frontend');
}
