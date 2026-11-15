import type {IMovie} from '@the-movies/shared';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export function getPosterUrl(movie: Pick<IMovie, 'posterPath'>): string | null {
  if (!movie.posterPath) return null;

  const originalUrl = `${TMDB_IMAGE_BASE}${movie.posterPath}`;
  return `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}`;
}

export function getBackdropUrl(movie: Pick<IMovie, 'backdropPath'>): string | null {
  if (!movie.backdropPath) return null;

  const originalUrl = `${TMDB_IMAGE_BASE}${movie.backdropPath}`;
  return `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}`;
}
