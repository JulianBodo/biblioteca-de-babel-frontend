import { Reader } from './reader.model';

export type LoanStatus = 'PENDING' | 'ACTIVE' | 'RETURNED' | 'REJECTED';

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

export interface LoanBook {
  id: number;
  isbn: string;
  title: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  genre: { id: number; name: string };
  publisher: { id: number; name: string };
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