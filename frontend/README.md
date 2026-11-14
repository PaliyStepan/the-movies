# TheMovies — Frontend

React SPA for browsing movies, with search, pagination, and auth. Built with Vite, Mantine, TanStack Query, Zustand, and Feature-Sliced Design.

## Stack

- **React 19** + **Vite**
- **Mantine** (UI components + notifications)
- **TanStack Query** (server state)
- **Zustand** (auth state: access token + user, in memory only)
- **React Router** (routing)
- **React Hook Form + Zod** (forms & validation)
- **Feature-Sliced Design** (app / pages / widgets / entities / features / shared)

## Environment

Copy `.env.example` to `.env`:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL, **including** `/v1` (e.g. `http://localhost:3000/v1`) |

## Run locally

    npm install
    npm run dev

App: http://localhost:5173

Backend must be running (see `../backend/README.md`).

## Structure (FSD)

    src/
    ├── app/          # providers, router, App.tsx, main.tsx
    ├── pages/        # login, register, movies-list, movie-detail
    ├── widgets/      # header
    ├── features/     # auth (useLogin, useRegister, useLogout)
    ├── entities/     # movie (MovieCard, useMovies, api)
    └── shared/       # api client, auth store, config, lib, ui

**Import rule:** a layer can only import from layers *below* it.

## Auth flow

1. `POST /auth/login` → `accessToken` + httpOnly `refreshToken` cookie
2. Access token stored **in Zustand memory** (never in `localStorage`)
3. On 401 → axios interceptor calls `POST /auth/refresh` and retries
4. On app start → `AuthInitializer` calls `refresh` → `getMe` → restores session
5. On logout → `POST /auth/logout`, clear Zustand + TanStack cache

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server (5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
