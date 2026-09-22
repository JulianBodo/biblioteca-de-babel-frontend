export interface Book {
  id: string;
  title: string;
  isbn: string;
  publicationYear: number;
  availableCopies?: number;
}