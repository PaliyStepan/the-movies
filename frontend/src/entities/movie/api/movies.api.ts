import {api} from '@/shared/api/client';
import {type ICreateMoviePayload, type IMovie, type IMovieListQuery, type IPaginated} from '@the-movies/shared';

export async function getMovies(
  query: IMovieListQuery,
  signal?: AbortSignal,
): Promise<IPaginated<IMovie>> {
  const {data} = await api.get<IPaginated<IMovie>>('/movies', {
    params: query,
    signal,
  });
  return data;
}

export async function getMovieById(
  id: string,
  signal?: AbortSignal,
): Promise<IMovie> {
  const {data} = await api.get<IMovie>(`/movies/${id}`, {signal});
  return data;
}

export async function getMovieRecommendations(
  id: string,
  signal?: AbortSignal,
): Promise<IMovie[]> {
  const {data} = await api.get<IMovie[]>(`/movies/${id}/recommendations`, {
    signal,
  });
  return data;
}

export async function getMovieFavoriteStatus(
  id: string,
  signal?: AbortSignal,
): Promise<{ isFavorite: boolean }> {
  const {data} = await api.get<{ isFavorite: boolean }>(
    `/movies/${id}/favorite`,
    {signal},
  );
  return data;
}

export async function createMovie(payload: ICreateMoviePayload): Promise<IMovie> {
  const {data} = await api.post<IMovie>('/movies', payload);
  return data;
}

export async function updateMovie(id: string, payload: Partial<ICreateMoviePayload>): Promise<IMovie> {
  const { data } = await api.patch<IMovie>(`/movies/${id}`, payload);
  return data;
}

export async function getMyMovies(
  params: { page?: number; limit?: number },
  signal?: AbortSignal,
): Promise<IPaginated<IMovie>> {
  const { data } = await api.get<IPaginated<IMovie>>('/movies/me', { params, signal });
  return data;
}

export async function getMyFavoriteMovies(
  params: { page?: number; limit?: number },
  signal?: AbortSignal,
): Promise<IPaginated<IMovie>> {
  const {data} = await api.get<IPaginated<IMovie>>('/movies/favorites', {
    params,
    signal,
  });
  return data;
}

export async function addMovieToFavorites(id: string): Promise<void> {
  await api.post(`/movies/${id}/favorite`);
}

export async function removeMovieFromFavorites(id: string): Promise<void> {
  await api.delete(`/movies/${id}/favorite`);
}

export async function deleteMovie(id: string): Promise<void> {
  await api.delete(`/movies/${id}`);
}
