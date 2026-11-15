import { useQuery } from '@tanstack/react-query';
import type { IMovieListQuery } from '@the-movies/shared';
import { getMovies } from '../api/movies.api';

export function useMovies(query: IMovieListQuery) {
  return useQuery({
    queryKey: ['movies', query],
    queryFn: ({ signal }) => getMovies(query, signal),
    enabled: (query.search?.trim().length ?? 0) >= 3,
  });
}

