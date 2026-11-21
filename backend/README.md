# TheMovies — Backend

NestJS 12 API with Prisma 7, PostgreSQL 16, JWT auth, movie recommendations and user-specific favorites.

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
| `DATABASE_URL` | PostgreSQL connection string used by both the API and Prisma CLI. For migrations, configure it to connect directly to PostgreSQL. |
| `JWT_SECRET` | Secret for signing tokens (change in prod) |
| `JWT_ACCESS_TOKEN_TTL` | Access token TTL (e.g. `15m`) |
| `JWT_REFRESH_TOKEN_TTL` | Refresh token TTL (e.g. `7d`) |
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default 3000) |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated |

`DIRECT_URL` is not currently read by the application or Prisma config. For local development, set `DATABASE_URL` to the database you want to use; the database itself must already exist.

## Run locally

### 1. Start Postgres

    docker run --name movie-db -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=movieapp -p 5432:5432 -v movie-db-data:/var/lib/postgresql/data -d postgres:16

Alternatively, use an existing local or hosted PostgreSQL database. Create an empty database, set its connection string in `DATABASE_URL` in `.env`, and skip the Docker step.

### 2. Configure, install & migrate

    cp .env.example .env

    npm install
    npx prisma7 migrate dev
    npx prisma7 generate

The example `.env` connection string matches the Docker command above. Edit it when using a different database, username, password, host, or port. `migrate dev` applies all committed migrations and creates the tables; it does not import movie data.

> If you use Prisma 7, run CLI via `npx prisma7` (package `@prisma/prisma7`). Plain `npx prisma` may pull Prisma 8 and break.

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
| PATCH | `/v1/auth/profile` | Update name/lastName (auth) |
| PATCH | `/v1/auth/password` | Change password (auth, `204`) |

### Movies

| Method | Path | Description |
|---|---|---|
| GET | `/v1/movies?search=&page=&limit=&sort=&order=` | Search (min. 3 chars), paginated |
| GET | `/v1/movies/me?page=&limit=` | Current user's created movies (auth) |
| GET | `/v1/movies/:id` | Movie by ID |
| GET | `/v1/movies/:id/recommendations` | Up to 10 movies with matching genres; popular-rated fallback when there are no matches |
| POST | `/v1/movies` | Create (auth) |
| PATCH | `/v1/movies/:id` | Update (author only) |
| DELETE | `/v1/movies/:id` | Delete (author only) |

### Favorites

Favorites are a many-to-many relation declared as `User.favorites Movie[]` and `Movie.favoritedBy User[]`. Prisma stores each user/movie pair in its implicit `_UserFavorites` join table; there is no global `isFavorite` field on `Movie`.

| Method | Path | Description |
|---|---|---|
| GET | `/v1/movies/favorites?page=&limit=` | Current user's favorites, paginated (auth) |
| GET | `/v1/movies/:id/favorite` | Check whether this movie is in the current user's favorites (auth); returns `{ "isFavorite": boolean }` |
| POST | `/v1/movies/:id/favorite` | Add movie to current user's favorites (auth, `204`) |
| DELETE | `/v1/movies/:id/favorite` | Remove movie from current user's favorites (auth, `204`) |

### Reviews

| Method | Path | Description |
|---|---|---|
| GET | `/v1/movies/:movieId/reviews?page=&limit=` | Paginated reviews for a movie |
| GET | `/v1/reviews/:id` | Review by ID |
| GET | `/v1/reviews/me?page=&limit=` | Current user's reviews (auth) |
| POST | `/v1/movies/:movieId/reviews` | Create a review (auth) |
| PATCH | `/v1/reviews/:id` | Update review (author only) |
| DELETE | `/v1/reviews/:id` | Delete review (author only, `204`) |

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Dev server with watch |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled build |
| `npx prisma7 migrate dev` | Create & apply migration (local) |
| `npx prisma7 migrate deploy` | Apply migrations (prod) |
| `npx prisma7 generate` | Regenerate Prisma Client |
| `npx prisma7 studio` | Open Prisma Studio |
