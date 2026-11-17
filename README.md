# TheMovies

Full-stack pet project: movie catalog with authentication, search, recommendations, reviews, and user-specific favorites.

**Stack:** NestJS 12 · Prisma 7 · PostgreSQL 16 · React 19 · Vite · Mantine · TanStack Query · Zustand · Swiper · TypeScript (ESM)

## Structure

    the-movies/
    ├── backend/      # NestJS API + Prisma
    ├── frontend/     # React SPA (Feature-Sliced Design)
    └── shared/       # Shared TypeScript types (IMovie, IUserPublic, ...)

## Quick start

### 1. Database (Docker)

    docker run --name movie-db -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=movieapp -p 5432:5432 -d postgres:17

### 2. Backend

    cd backend
    cp .env.example .env
    npm install
    npx prisma migrate dev
    npx prisma generate
    npm run start:dev

API: http://localhost:3000  
Swagger: http://localhost:3000/docs/v1

### 3. Frontend

    cd frontend
    cp .env.example .env
    npm install
    npm run dev

App: http://localhost:5173

## Features

- JWT auth (access 15m + refresh 7d in httpOnly cookie)
- Movie CRUD with author check
- Search (min. 3 chars, debounced), pagination, sorting
- Genre-based movie recommendations with popular-rated fallback
- User-specific movie favorites and a paginated favorites list in the personal account
- Movie reviews
- TMDB dataset import (~10k movies)
- TMDB poster proxy (bypasses regional blocks)

Favorite movies are stored as a many-to-many `User`–`Movie` relation in Prisma's implicit `_UserFavorites` join table. Apply database migrations before running the app.

## Docs

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## Live demo

- Frontend: _TBD_
- API: _TBD_
