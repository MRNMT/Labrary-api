import { Request, Response, NextFunction } from 'express';
import { authors } from '../models/author';

export function validateAuthorPayload(req: Request, res: Response, next: NextFunction) {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Author `name` is required and must be a non-empty string' });
  }
  next();
}

export function validateBookPayload(req: Request, res: Response, next: NextFunction) {
  const { title, authorId, year } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Book `title` is required and must be a non-empty string' });
  }
  if (!authorId || typeof authorId !== 'string') {
    return res.status(400).json({ error: 'Book `authorId` is required and must be a string' });
  }
  const authorExists = authors.find((a) => a.id === authorId);
  if (!authorExists) {
    return res.status(400).json({ error: '`authorId` does not reference an existing author' });
  }
  if (year !== undefined && typeof year !== 'number') {
    return res.status(400).json({ error: '`year` must be a number if provided' });
  }
  next();
}
