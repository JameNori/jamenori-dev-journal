# Jamenori Dev Journal

Full-stack dev journal / blog application with a public reader experience and an admin area for managing articles and categories.

## Tech stack

- **Frontend** (`frontend/`): React 19, Vite 7, Tailwind CSS 4, React Router, Radix UI
- **Backend** (`backend/`): Express 5, PostgreSQL (`postgres` / `pg`), Supabase client, JWT-style auth via API

## Repository layout

| Path        | Role                                      |
| ----------- | ----------------------------------------- |
| `frontend/` | Vite + React SPA                          |
| `backend/`  | REST API (Express)                        |

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A PostgreSQL database and [Supabase](https://supabase.com/) project (for the variables below)

## Environment variables

### Backend (`backend/.env`)

Create `backend/.env` with at least:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

`PORT` is optional; it defaults to `3000`.

### Frontend (`frontend/.env`)

Optional — if the API is not on `http://localhost:3000`, set:

```env
VITE_API_URL=http://localhost:3000
```

## Getting started

Install dependencies and run backend and frontend in two terminals.

**Backend**

```bash
cd backend
npm install
npm start
```

API listens on `http://localhost:3000` by default. You can verify the server with `GET /` or `GET /test-db` if your database is configured.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints in the terminal (typically `http://localhost:5173`).

## Demo accounts (for reviewers / interviewers)

These accounts are provided **for demonstration purposes only**.

### User (reader)

| Field    | Value                         |
| -------- | ----------------------------- |
| Email    | `reviewer@jamenori-dev-journal.com` |
| Password | `Demo1234!`                   |

### Admin

| Field    | Value                        |
| -------- | ---------------------------- |
| Email    | `admin@jamenori-dev-journal.com` |
| Password | `Admin1234!`                 |

- **User:** sign in at `/login` on the main site.
- **Admin:** sign in at `/admin/login`, then use the admin dashboard under `/admin`.

## Scripts

| Location   | Command       | Description        |
| ---------- | ------------- | ------------------ |
| `frontend` | `npm run dev` | Dev server (Vite)  |
| `frontend` | `npm run build` | Production build |
| `frontend` | `npm run lint`  | ESLint           |
| `backend`  | `npm start`   | Start API server   |
