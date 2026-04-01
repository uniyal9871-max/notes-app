# 📝 Notes App

A full-stack personal notes application built with React, Node.js/Express, and MongoDB.

Live links (fill in after deployment):
- **Frontend:** `https://your-app.netlify.app`
- **Backend:** `https://your-app.railway.app`

---

## Tech Stack

- **Frontend:** React 18, React Router v6, Vite, react-markdown
- **Backend:** Node.js, Express, JWT auth
- **Database:** MongoDB (Atlas)
- **Deployment:** Netlify (frontend) + Railway (backend)

---

## Features

- Register and log in with JWT authentication
- Create, edit, and delete personal notes (each with title + body)
- Notes are user-scoped — users only see their own notes
- Auto-save while editing (1.2 s debounce)
- Search/filter notes by title or body
- Markdown rendering in note preview
- Note tags (comma-separated)
- Responsive layout

---

## Local Setup

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) free-tier cluster (or local MongoDB)

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/notes-app.git
cd notes-app
```

---

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/notesapp
JWT_SECRET=some_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev   # uses nodemon for auto-reload
# or
npm start     # production
```

The API will be available at `http://localhost:5000`.

---

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Running with Docker

### Backend only

```bash
cd backend
docker build -t notes-app-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI="your_mongo_uri" \
  -e JWT_SECRET="your_secret" \
  -e FRONTEND_URL="http://localhost:5173" \
  notes-app-backend
```

### Full stack with Docker Compose

Create a `docker-compose.yml` in the root:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=http://localhost:5173
```

Then run:

```bash
docker compose up
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                              | Example                          |
|----------------|------------------------------------------|----------------------------------|
| `PORT`          | Port the server listens on              | `5000`                           |
| `MONGODB_URI`   | MongoDB Atlas connection string          | `mongodb+srv://...`              |
| `JWT_SECRET`    | Secret key for signing JWTs             | `some_long_random_string`        |
| `FRONTEND_URL`  | Allowed CORS origin                     | `https://your-app.netlify.app`   |

### Frontend (`frontend/.env`)

| Variable        | Description                              | Example                                    |
|----------------|------------------------------------------|--------------------------------------------|
| `VITE_API_URL`  | Backend API base URL                    | `https://your-backend.railway.app/api`     |

---

## API Endpoints

### Auth

| Method | Endpoint              | Description         |
|--------|----------------------|---------------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Log in              |

### Notes (all require `Authorization: Bearer <token>`)

| Method | Endpoint          | Description         |
|--------|------------------|---------------------|
| GET    | `/api/notes`     | Get all user notes  |
| POST   | `/api/notes`     | Create a note       |
| GET    | `/api/notes/:id` | Get a single note   |
| PUT    | `/api/notes/:id` | Update a note       |
| DELETE | `/api/notes/:id` | Delete a note       |

---

## Deployment

### Backend → Railway

1. Push to GitHub
2. Create a new Railway project, link the repo, set root to `/backend`
3. Add environment variables in Railway dashboard (never commit `.env`)
4. Railway auto-deploys on push

### Frontend → Netlify

1. Create a new Netlify site, link the repo, set base to `frontend`, build command `npm run build`, publish dir `dist`
2. Add `VITE_API_URL` in Netlify environment variables
3. The `public/_redirects` file handles React Router client-side routing
