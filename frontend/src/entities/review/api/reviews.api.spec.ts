import { afterEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({ api }));

import {
  createReview,
  deleteReview,
  getMyReviews,
  getReviewById,
  getReviewsByMovie,
  updateReview,
} from './reviews.api';

describe('reviews API', () => {
  afterEach(() => vi.clearAllMocks());

  it('requests paginated reviews for a movie', async () => {
    const response = { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    api.get.mockResolvedValue({ data: response });

    await expect(
      getReviewsByMovie('movie-1', { page: 1, limit: 10 }),
    ).resolves.toEqual(response);
    expect(api.get).toHaveBeenCalledWith('/movies/movie-1/reviews', {
      params: { page: 1, limit: 10 },
      signal: undefined,
    });
  });

  it('creates, updates, fetches and deletes a review', async () => {
    const review = { id: 'review-1' };
    api.post.mockResolvedValue({ data: review });
    api.patch.mockResolvedValue({ data: review });
    api.get.mockResolvedValue({ data: review });
    api.delete.mockResolvedValue({});

    await createReview('movie-1', { description: 'Good movie' });
    expect(api.post).toHaveBeenCalledWith('/movies/movie-1/reviews', {
      description: 'Good movie',
    });

    await updateReview('review-1', { description: 'Updated review' });
    expect(api.patch).toHaveBeenCalledWith('/reviews/review-1', {
      description: 'Updated review',
    });

    await getReviewById('review-1');
    expect(api.get).toHaveBeenCalledWith('/reviews/review-1', {
      signal: undefined,
    });

    await deleteReview('review-1');
    expect(api.delete).toHaveBeenCalledWith('/reviews/review-1');
  });

  it('requests paginated reviews for the current user', async () => {
    const response = { items: [], total: 3, page: 1, limit: 10, totalPages: 1 };
    api.get.mockResolvedValue({ data: response });

    await expect(getMyReviews({ page: 1, limit: 10 })).resolves.toEqual(
      response,
    );
    expect(api.get).toHaveBeenCalledWith('/reviews/me', {
      params: { page: 1, limit: 10 },
      signal: undefined,
    });
  });
});
