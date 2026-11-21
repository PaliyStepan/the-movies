# TheMovies

Full-stack pet project: movie catalog with authentication, search, recommendations, reviews, favorites, and a personal account.

**Stack:** NestJS 12 · Prisma 7 · PostgreSQL 16 · React 19 · Vite · Mantine · TanStack Query · Zustand · Swiper · TypeScript (ESM)

## Structure

    the-movies/
    ├── backend/      # NestJS API + Prisma
    ├── frontend/     # React SPA (Feature-Sliced Design)
    └── shared/       # Shared TypeScript types (IMovie, IUserPublic, ...)

## Quick start

**Requirements:** Node.js 22.12+ (npm included), and Docker with PostgreSQL, or an existing PostgreSQL database.

### 1. Database (Docker)

    docker run --name movie-db -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=movieapp -p 5432:5432 -v movie-db-data:/var/lib/postgresql/data -d postgres:16

The named volume keeps database files when the container is stopped or removed. Wait until PostgreSQL is ready to accept connections.

To use your own PostgreSQL instead, create an empty database and set `DATABASE_URL` in `backend/.env` to its connection string (for example, `postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public`). You do not need to start the Docker container in that case.

### 2. Backend

    cd backend
    cp .env.example .env
    # Edit DATABASE_URL if you are not using the Docker defaults above.
    npm install
    npx prisma7 migrate dev
    npx prisma7 generate
    npm run start:dev

API: http://localhost:3000  
Swagger: http://localhost:3000/docs/v1

### 3. Frontend

    cd frontend
    cp .env.example .env
    npm install
    npm run dev

App: http://localhost:5173

The migrations create the schema but do not populate the movie catalog. To add movies, follow the optional [TMDB dataset import](./backend/README.md#import-movies-tmdb-dataset) instructions.

## Features

- JWT auth (access 15m + refresh 7d in httpOnly cookie, stateless)
- Movie CRUD with author check
- Search (min. 3 chars, debounced), pagination, sorting
- Genre-based movie recommendations with popular-rated fallback
- User-specific favorites (many-to-many) with a paginated list in the personal account
- Movie reviews with author check
- Personal account: profile, password change, my reviews, my movies, favorites
- TMDB dataset import (~10k movies)
- TMDB posters served through `wsrv.nl` (bypasses regional CDN blocks)

## Docs

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## Live demo

- Frontend: https://the-movies-app.layero.app
- API: https://the-movies-bff.layero.app/v1
- Swagger: https://the-movies-bff.layero.app/docs/v1

> Note: TMDB's image CDN is blocked in some regions. Posters are proxied through `wsrv.nl`; if images still don't load, a VPN may be required.
