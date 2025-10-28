import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err?.message || err);
  if (res.headersSent) return next(err);
  const status = err?.status || 500;
  res.status(status).json({ error: err?.message || 'Internal Server Error' });
}
