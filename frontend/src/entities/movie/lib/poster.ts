import type {IMovie} from '@the-movies/shared';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';


export function getPosterUrl(movie: Pick<IMovie, 'posterPath'>): string | null {
  if (!movie.posterPath) return null;

  if (movie.posterPath.startsWith('http://') || movie.posterPath.startsWith('https://')) {
    return movie.posterPath;
  }

  const originalUrl = `${TMDB_IMAGE_BASE}${movie.posterPath}`;
  return `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}`;
}

export function getBackdropUrl(movie: Pick<IMovie, 'backdropPath'>): string | null {
  if (!movie.backdropPath) return null;

  if (movie.backdropPath.startsWith('http://') || movie.backdropPath.startsWith('https://')) {
    return movie.backdropPath;
  }

  const originalUrl = `${TMDB_BACKDROP_BASE}${movie.backdropPath}`;
  return `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}`;
}
