import type { IMovie } from '@the-movies/shared';

const API_BASE = import.meta.env.VITE_API_URL;

export function getPosterUrl(movie: Pick<IMovie, 'posterPath'>): string | null {
  if (!movie.posterPath) return null;
  return `${API_BASE}/poster?path=${encodeURIComponent(movie.posterPath)}`;
}

export function getBackdropUrl(movie: Pick<IMovie, 'backdropPath'>): string | null {
  if (!movie.backdropPath) return null;
  return `${API_BASE}/poster?path=${encodeURIComponent(movie.backdropPath)}`;
}
