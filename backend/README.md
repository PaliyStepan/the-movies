# TheMovies — Backend

NestJS 12 API with Prisma 7, PostgreSQL 16, JWT auth, and TMDB poster proxy.

## Stack

- **NestJS 12** (ESM, `"type": "module"`)
- **Prisma 7** (`prisma-client` generator, ESM output to `src/generated/prisma`)
- **PostgreSQL 16** (Docker locally, Prisma Postgres in prod)
- **Auth:** `@nestjs/jwt` + `passport-jwt`, argon2, httpOnly refresh cookie
- **Docs:** Swagger at `/docs/v1`

## Environment

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing tokens (change in prod) |
| `JWT_ACCESS_TOKEN_TTL` | Access token TTL (e.g. `15m`) |
| `JWT_REFRESH_TOKEN_TTL` | Refresh token TTL (e.g. `7d`) |
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default 3000) |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated |

## Run locally

### 1. Start Postgres

    docker run --name movie-db -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=movieapp -p 5432:5432 -d postgres:17

### 2. Install & migrate

    npm install
    npx prisma migrate dev
    npx prisma generate

### 3. Dev server

    npm run start:dev

Swagger: http://localhost:3000/docs/v1

## Import movies (TMDB dataset)

1. Download the dataset from Kaggle and put the CSV at `prisma/data/tmdb_movies.csv`.
2. Run:

       npx tsx prisma/import-movies.ts

Imports ~10k movies with posters, descriptions, ratings, and genre IDs. Skips rows without poster or overview.

## API

All routes are versioned under `/v1`.

### Auth

| Method | Path | Description |
|---|---|---|
| POST | `/v1/auth/register` | Create account |
| POST | `/v1/auth/login` | Login (sets refresh cookie) |
| POST | `/v1/auth/refresh` | Rotate access token via cookie |
| POST | `/v1/auth/logout` | Clear refresh cookie |
| GET | `/v1/auth/@me` | Current user (auth required) |

### Movies

| Method | Path | Description |
|---|---|---|
| GET | `/v1/movies?search=&page=&limit=&sort=&order=` | Search (min. 3 chars), paginated |
| GET | `/v1/movies/:id` | Movie by ID |
| POST | `/v1/movies` | Create (auth) |
| PATCH | `/v1/movies/:id` | Update (author only) |
| DELETE | `/v1/movies/:id` | Delete (author only) |

### Poster proxy

| Method | Path | Description |
|---|---|---|
| GET | `/v1/poster?path=/xxx.jpg` | Proxies TMDB images (bypasses regional blocks) |

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Dev server with watch |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled build |
| `npx prisma migrate dev` | Create & apply migration |
| `npx prisma migrate deploy` | Apply migrations (prod) |
| `npx prisma generate` | Regenerate Prisma Client |
| `npx prisma studio` | Open Prisma Studio |
