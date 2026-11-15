import type {IMovie} from '@the-movies/shared';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export function getPosterUrl(movie: Pick<IMovie, 'posterPath'>): string | null {
  if (!movie.posterPath) return null;

  if (movie.posterPath.startsWith('http://') || movie.posterPath.startsWith('https://')) {
    return movie.posterPath;
  }

  const originalUrl = `${TMDB_IMAGE_BASE}${movie.posterPath}`;
  return `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}`;
}
