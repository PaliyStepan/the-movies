export const ERoutes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  MOVIE_DETAIL: '/movies/:id',
  MOVIE_CREATE: '/movies/create',
} as const;

export function movieDetailPath(id: string): string {
  return `/movies/${id}`;
}
