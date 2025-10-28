import express from 'express';
import { books, Book, newBookId } from '../models/book';
import { authors } from '../models/author';
import { validateBookPayload } from '../middleware/validate';

const router = express.Router();

// Create Book
router.post('/', validateBookPayload, (req, res) => {
  const { title, authorId, year, summary } = req.body as Partial<Book>;
  // Conflict: duplicate book (same title + author)
  const exists = books.find((b) => b.title.toLowerCase() === title!.trim().toLowerCase() && b.authorId === authorId);
  if (exists) return res.status(409).json({ error: 'Duplicate book for the same author' });

  const id = newBookId();
  const book: Book = { id, title: title!.trim(), authorId: authorId!, year, summary };
  books.push(book);
  res.status(201).json(book);
});

// List Books with optional filtering, search, sort, pagination
router.get('/', (req, res) => {
  let results = books.slice();
  const { title, author, year, sortBy, order = 'asc', page = '1', limit = '20' } = req.query as any;

  if (title) {
    const q = String(title).toLowerCase();
    results = results.filter((b) => b.title.toLowerCase().includes(q));
  }
  if (author) {
    const q = String(author).toLowerCase();
    // author may be authorId or partial author name - match by id or name
    results = results.filter((b) => b.authorId === q || authors.find((a) => a.id === b.authorId && a.name.toLowerCase().includes(q)));
  }
  if (year) {
    const y = Number(year);
    if (!Number.isNaN(y)) results = results.filter((b) => b.year === y);
  }

  if (sortBy) {
    const key = String(sortBy);
    results.sort((a: any, b: any) => {
      const va = a[key];
      const vb = b[key];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va < vb) return order === 'asc' ? -1 : 1;
      if (va > vb) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // pagination
  const p = Math.max(1, parseInt(page, 10) || 1);
  const lim = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const start = (p - 1) * lim;
  const paged = results.slice(start, start + lim);

  res.json({ total: results.length, page: p, limit: lim, data: paged });
});

// Get book by id
router.get('/:id', (req, res) => {
  const b = books.find((x) => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Book not found' });
  res.json(b);
});

// Update book
router.put('/:id', validateBookPayload, (req, res) => {
  const b = books.find((x) => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Book not found' });
  const { title, authorId, year, summary } = req.body as Partial<Book>;
  // check duplicate conflict excluding self
  const dup = books.find((x) => x.id !== b.id && x.title.toLowerCase() === title!.trim().toLowerCase() && x.authorId === authorId);
  if (dup) return res.status(409).json({ error: 'Duplicate book for the same author' });

  b.title = title!.trim();
  b.authorId = authorId!;
  b.year = year;
  b.summary = summary;
  res.json(b);
});

// Delete book
router.delete('/:id', (req, res) => {
  const idx = books.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  const removed = books.splice(idx, 1)[0];
  res.json(removed);
});

export default router;
