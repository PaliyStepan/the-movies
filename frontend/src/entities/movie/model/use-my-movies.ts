import { useQuery } from '@tanstack/react-query';
import { getMyMovies } from '../api/movies.api';

export function useMyMovies(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ['my-movies', params],
    queryFn: ({ signal }) => getMyMovies(params, signal),
  });
}
