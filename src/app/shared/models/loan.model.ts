import { Reader } from './reader.model';
import { Author, Genre, Publisher } from './book.model';

export type LoanStatus = 'PENDING' | 'ACTIVE' | 'RETURNED' | 'REJECTED';

export interface LoanBook {
  id: number;
  isbn: string;
  title: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  genre: Genre;
  publisher: Publisher;
  authors: Author[];
}

export interface Loan {
  id: number;
  readerId: number;
  bookId: number;
  status: LoanStatus;
  loanDate: string | null;
  dueDate: string | null;
  returnDate: string | null;
  createdAt: string;
  updatedAt: string;
  reader: Reader;
  book: LoanBook;
  daysOnLoan?: number | null;
  isOverdue?: boolean;
  daysOverdue?: number;
  overdueNotice?: string | null;
  wasLate?: boolean;
}

export interface LoanCreate {
  readerId: number;
  bookId: number;
}