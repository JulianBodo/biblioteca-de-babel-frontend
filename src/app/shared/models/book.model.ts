export interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  isbn: string;
  title: string;
  publicationYear: number;
  genreId: number;
  publisherId: number;
  totalCopies: number;
  availableCopies: number;
  genre: Genre;
  publisher: Publisher;
  authors: Author[];
}

export interface BookInput {
  isbn: string;
  title: string;
  publicationYear: number;
  authorIds: number[];
  publisherId: number;
  genreId: number;
  totalCopies: number;
}