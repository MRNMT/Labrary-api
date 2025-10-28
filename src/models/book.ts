export interface Book {
  id: string;
  title: string;
  authorId: string;
  year?: number;
  summary?: string;
}

export const books: Book[] = [];

let bookCounter = 1;
export function newBookId(): string {
  return String(bookCounter++);
}
