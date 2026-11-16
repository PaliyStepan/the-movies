import { useQuery } from '@tanstack/react-query';
import { getMyReviews } from '../api/reviews.api';

export function useMyReviews(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ['my-reviews', params],
    queryFn: ({ signal }) => getMyReviews(params, signal),
  });
}
