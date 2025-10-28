import express from 'express';
import authorsRouter from './routes/authors';
import booksRouter from './routes/books';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => res.json({ service: 'iabrary-api', status: 'ok' }));

app.use('/authors', authorsRouter);
app.use('/books', booksRouter);

// 404 for unknown routes
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
