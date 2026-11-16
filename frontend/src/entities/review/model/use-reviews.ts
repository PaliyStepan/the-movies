import { useQuery } from '@tanstack/react-query';
import { getReviewsByMovie, getReviewById } from '../api/reviews.api';

export function useReviews(movieId: string) {
  return useQuery({
    queryKey: ['reviews', movieId],
    queryFn: ({ signal }) => getReviewsByMovie(movieId, signal),
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
