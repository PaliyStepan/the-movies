import type { IMovie } from '@the-movies/shared';


export const API_PROXY_BASE = import.meta.env.VITE_API_URL;

export function getPosterUrl(movie: Pick<IMovie, 'posterPath'>): string | null {
  if (!movie.posterPath) return null;
  return `${API_PROXY_BASE}/movies/poster?path=${encodeURIComponent(movie.posterPath)}`;
}
