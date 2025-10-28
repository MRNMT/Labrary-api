import express from 'express';
import { authors, Author, newAuthorId } from '../models/author';
import { books } from '../models/book';
import { validateAuthorPayload } from '../middleware/validate';

const router = express.Router();

// Create Author
router.post('/', validateAuthorPayload, (req, res) => {
  const { name, bio, yearOfBirth } = req.body as Partial<Author>;
  const id = newAuthorId();
  const author: Author = { id, name: name!.trim(), bio, yearOfBirth };
  authors.push(author);
  res.status(201).json(author);
});

// List Authors
router.get('/', (req, res) => {
  res.json(authors);
});

// Get Author by ID
router.get('/:id', (req, res) => {
  const a = authors.find((x) => x.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Author not found' });
  res.json(a);
});

// Update Author
router.put('/:id', validateAuthorPayload, (req, res) => {
  const a = authors.find((x) => x.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Author not found' });
  const { name, bio, yearOfBirth } = req.body as Partial<Author>;
  a.name = name!.trim();
  a.bio = bio;
  a.yearOfBirth = yearOfBirth;
  res.json(a);
});

// Delete Author
router.delete('/:id', (req, res) => {
  const idx = authors.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Author not found' });
  // Also remove any books by the author
  for (let i = books.length - 1; i >= 0; i--) {
    if (books[i].authorId === req.params.id) books.splice(i, 1);
  }
  const removed = authors.splice(idx, 1)[0];
  res.json(removed);
});

// List books by author
router.get('/:id/books', (req, res) => {
  const a = authors.find((x) => x.id === req.params.id);
  if (!a) return res.status(404).json({ error: 'Author not found' });
  const authorBooks = books.filter((b) => b.authorId === a.id);
  res.json(authorBooks);
});

export default router;
