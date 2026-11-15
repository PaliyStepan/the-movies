export const ERoutes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MOVIE_DETAIL: '/movies/:id',
  MOVIE_CREATE: '/movies/create',
  MOVIE_EDIT: '/movies/edit/:id',
} as const;

export function movieDetailPath(id: string): string {
  return `/movies/${id}`;
}

export function movieEditPath(id: string): string {
  return `/movies/edit/${id}`;
}
