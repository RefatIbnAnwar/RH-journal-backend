# Journal Backend

A REST API for a personal journal application built with Node.js, Express 5, and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator

## Features

- **JWT Authentication** — Register and login with hashed passwords. Access tokens protect all journal entry routes.
- **CRUD Operations** — Create, read, update, and delete journal entries. Each entry is scoped to its owner.
- **Input Validation & Sanitization** — All request bodies and URL parameters are validated and sanitized before reaching controllers. Emails are normalized, strings are trimmed, and lengths are enforced.
- **Centralized Error Handling** — A custom `AppError` class and global error handler middleware produce consistent error responses across the entire API. Mongoose, JWT, and JSON parse errors are all caught and translated into clean client-facing messages.
- **Ownership Enforcement** — Users can only access, modify, or delete their own entries.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/<your-username>/journal-backend.git
cd journal-backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/journal-app
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
PORT=5000
```

### Run

```bash
npm run dev     # development (auto-restart on file changes)
npm start       # production
```

## API Endpoints

### Auth

| Method | Endpoint             | Description      | Auth |
|--------|----------------------|------------------|------|
| POST   | `/api/auth/register` | Create account   | No   |
| POST   | `/api/auth/login`    | Login, get token | No   |

### Journal Entries

All entry endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint            | Description       |
|--------|---------------------|-------------------|
| GET    | `/api/entries`      | List all entries  |
| GET    | `/api/entries/:id`  | Get single entry  |
| POST   | `/api/entries`      | Create entry      |
| PUT    | `/api/entries/:id`  | Update entry      |
| DELETE | `/api/entries/:id`  | Delete entry      |

### Request Examples

**Register**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Create Entry**
```json
POST /api/entries
Authorization: Bearer <token>
{
  "title": "My First Entry",
  "content": "Today I started building a journal app.",
  "date": "2026-09-26"
}
```

### Error Response Format

All errors follow a consistent structure:

```json
{
  "status": "error",
  "message": "Email is required, Password must be at least 6 characters",
  "details": [
    { "msg": "Email is required", "path": "email", "location": "body" },
    { "msg": "Password must be at least 6 characters", "path": "password", "location": "body" }
  ]
}
```

## Project Structure

```
server.js                  # App entry point, DB connection, middleware chain
controllers/
  authController.js        # Register and login logic
  entriesController.js     # CRUD operations for journal entries
routes/
  auth.js                  # Auth route definitions with validation
  entries.js               # Entry route definitions with validation
models/
  User.js                  # User schema with password hashing (pre-save hook)
  JournalEntry.js          # Journal entry schema
middleware/
  auth.js                  # JWT verification middleware
  errorHandler.js          # Global error handler + 404 handler
  validate.js              # Validation result checker
validators/
  auth.js                  # Validation rules for auth routes
  entries.js               # Validation rules for entry routes
errors/
  AppError.js              # Custom error class with status codes
```
