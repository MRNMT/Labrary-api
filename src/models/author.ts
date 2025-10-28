export interface Author {
  id: string;
  name: string;
  bio?: string;
  yearOfBirth?: number;
}

// simple in-memory store
export const authors: Author[] = [];

// helper to generate incremental ids
let authorCounter = 1;
export function newAuthorId(): string {
  return String(authorCounter++);
}
