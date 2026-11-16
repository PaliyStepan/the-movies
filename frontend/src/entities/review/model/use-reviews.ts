import { useQuery } from '@tanstack/react-query';
import { getReviewsByMovie, getReviewById } from '../api/reviews.api';

export function useReviews(
  movieId: string,
  params: { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: ['reviews', movieId, params],
    queryFn: ({ signal }) => getReviewsByMovie(movieId, params, signal),
    enabled: !!movieId,
  });
}

export function useReview(id: string) {
  return useQuery({
    queryKey: ['review', id],
    queryFn: ({ signal }) => getReviewById(id, signal),
    enabled: !!id,
  });
}
