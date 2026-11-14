import { api } from '@/shared/api/client';
import type { IMovie, IMovieListQuery, IPaginated } from '@the-movies/shared';

export async function getMovies(
  query: IMovieListQuery,
  signal?: AbortSignal,
): Promise<IPaginated<IMovie>> {
  const { data } = await api.get<IPaginated<IMovie>>('/movies', {
    params: query,
    signal,
  });
  return data;
}

export async function getMovieById(
  id: string,
  signal?: AbortSignal,
): Promise<IMovie> {
  const { data } = await api.get<IMovie>(`/movies/${id}`, { signal });
  return data;
}
