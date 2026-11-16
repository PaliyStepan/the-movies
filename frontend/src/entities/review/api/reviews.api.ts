import type {
  IReview,
  ICreateReviewPayload,
  IUpdateReviewPayload,
} from '@the-movies/shared';
import { api } from '@/shared/api/client';

export async function getReviewsByMovie(
  movieId: string,
  signal?: AbortSignal,
): Promise<IReview[]> {
  const { data } = await api.get<IReview[]>(`/movies/${movieId}/reviews`, { signal });
  return data;
}

export async function getReviewById(
  id: string,
  signal?: AbortSignal,
): Promise<IReview> {
  const { data } = await api.get<IReview>(`/reviews/${id}`, { signal });
  return data;
}

export async function createReview(
  movieId: string,
  payload: ICreateReviewPayload,
): Promise<IReview> {
  const { data } = await api.post<IReview>(`/movies/${movieId}/reviews`, payload);
  return data;
}

export async function updateReview(
  id: string,
  payload: IUpdateReviewPayload,
): Promise<IReview> {
  const { data } = await api.patch<IReview>(`/reviews/${id}`, payload);
  return data;
}

export async function deleteReview(id: string): Promise<void> {
  await api.delete(`/reviews/${id}`);
}
