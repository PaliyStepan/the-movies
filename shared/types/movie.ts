export const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

export interface IMovie {
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

export interface IMovieListQuery {
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'title' | 'year' | 'tmdbRating' | 'voteCount' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface IPaginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICreateMoviePayload {
  title: string;
  year?: number;
  description?: string;
  originalTitle?: string;
  originalLanguage?: string;
  posterPath?: string;
  tmdbRating?: number;
  voteCount?: number;
  genreIds?: number[];
}
