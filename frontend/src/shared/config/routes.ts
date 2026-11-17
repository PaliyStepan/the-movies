export const ERoutes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LK: '/lk',
  LK_REVIEWS: '/lk/reviews',
  LK_MOVIES: '/lk/movies',
  LK_FAVORITES: '/lk/favorites',
  MOVIE_CREATE: '/movies/create',
  MOVIE_EDIT: '/movies/edit/:id',
  MOVIE_DETAIL: '/movies/:id',
  REVIEWS_LIST: '/movies/:movieId/reviews',
  REVIEW_CREATE: '/movies/:movieId/reviews/create',
  REVIEW_DETAIL: '/reviews/:id',
  REVIEW_EDIT: '/reviews/:id/edit',
} as const;

export function movieDetailPath(id: string): string {
  return `/movies/${id}`;
}

export function movieEditPath(id: string): string {
  return `/movies/edit/${id}`;
}

export function reviewsListPath(movieId: string): string {
  return `/movies/${movieId}/reviews`;
}

export function reviewCreatePath(movieId: string): string {
  return `/movies/${movieId}/reviews/create`;
}

export function reviewDetailPath(id: string): string {
  return `/reviews/${id}`;
}

export function reviewEditPath(id: string): string {
  return `/reviews/${id}/edit`;
}
