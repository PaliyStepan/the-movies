export const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

export interface Movie {
  id: string;
  tmdbId: number | null;
  title: string;
  originalTitle: string | null;
  originalLanguage: string | null;
  year: number | null;
  description: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  tmdbRating: number | null;
  voteCount: number | null;
  genreIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface MovieListQuery {
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'title' | 'year' | 'tmdbRating' | 'voteCount' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getPosterUrl(movie: Pick<Movie, 'posterPath'>): string | null {
  return movie.posterPath ? `${TMDB_POSTER_BASE}${movie.posterPath}` : null;
}

export function getBackdropUrl(movie: Pick<Movie, 'backdropPath'>): string | null {
  return movie.backdropPath ? `${TMDB_BACKDROP_BASE}${movie.backdropPath}` : null;
}
