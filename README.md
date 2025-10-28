# Liabrary-api

Minimal in-memory REST API for Authors and Books (TypeScript + Express).

Features
- CRUD for Authors and Books
- Books reference authors (authorId required)
- Validation middleware
- Logger middleware (method & URL)
- Centralized error handling
- Book listing supports filtering, sorting, pagination

Getting started

1. Install dependencies

```bash
npm install
```

2. Run in dev mode

```bash
npm run dev
```

API Endpoints (summary)

- POST /authors -> create author { name, bio?, yearOfBirth? }
- GET /authors -> list all authors
- GET /authors/:id -> get author
- PUT /authors/:id -> update author
- DELETE /authors/:id -> delete author (also removes their books)
- GET /authors/:id/books -> list books by author

- POST /books -> create book { title, authorId, year?, summary? }
- GET /books -> list books (query: title, author, year, sortBy, order, page, limit)
- GET /books/:id -> get book
- PUT /books/:id -> update book
- DELETE /books/:id -> delete book

Notes
- Data is stored in-memory and will be lost when the process restarts.
- The server rejects invalid payloads (400), not found (404), and duplicate book for same author (409).

Try with curl

```bash
# create an author
curl -s -X POST http://localhost:3000/authors -H 'Content-Type: application/json' -d '{"name":"Jane Doe"}' | jq

# create a book (replace authorId with created id)
curl -s -X POST http://localhost:3000/books -H 'Content-Type: application/json' -d '{"title":"My Book","authorId":"1","year":2020}' | jq

# list books
curl -s http://localhost:3000/books | jq
```
# Labrary-api
