import { afterEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({ api }));

import {
  addMovieToFavorites,
  getMovieById,
  getMovieFavoriteStatus,
  getMovieRecommendations,
  getMovies,
  getMyFavoriteMovies,
  removeMovieFromFavorites,
} from './movies.api';

describe('movies API', () => {
  afterEach(() => vi.clearAllMocks());

  it('sends movie search and pagination parameters', async () => {
    const response = { items: [], total: 0, page: 2, limit: 10, totalPages: 0 };
    const signal = new AbortController().signal;
    api.get.mockResolvedValue({ data: response });

    await expect(
      getMovies({ search: 'alien', page: 2, limit: 10 }, signal),
    ).resolves.toEqual(response);
    expect(api.get).toHaveBeenCalledWith('/movies', {
      params: { search: 'alien', page: 2, limit: 10 },
      signal,
    });
  });

  it('requests a movie and its recommendations by ID', async () => {
    const signal = new AbortController().signal;
    api.get.mockResolvedValue({ data: { id: 'movie-1' } });

    await getMovieById('movie-1', signal);
    expect(api.get).toHaveBeenNthCalledWith(1, '/movies/movie-1', { signal });

    await getMovieRecommendations('movie-1', signal);
    expect(api.get).toHaveBeenNthCalledWith(
      2,
      '/movies/movie-1/recommendations',
      { signal },
    );
  });

  it('checks, adds and removes a movie from the current user’s favorites', async () => {
    const signal = new AbortController().signal;
    api.get.mockResolvedValue({ data: { isFavorite: true } });
    api.post.mockResolvedValue({});
    api.delete.mockResolvedValue({});

    await expect(getMovieFavoriteStatus('movie-1', signal)).resolves.toEqual({
      isFavorite: true,
    });
    expect(api.get).toHaveBeenCalledWith('/movies/movie-1/favorite', { signal });

    await addMovieToFavorites('movie-1');
    expect(api.post).toHaveBeenCalledWith('/movies/movie-1/favorite');

    await removeMovieFromFavorites('movie-1');
    expect(api.delete).toHaveBeenCalledWith('/movies/movie-1/favorite');
  });

  it('requests a paginated favorites list', async () => {
    const response = { items: [], total: 12, page: 2, limit: 10, totalPages: 2 };
    const signal = new AbortController().signal;
    api.get.mockResolvedValue({ data: response });

    await expect(
      getMyFavoriteMovies({ page: 2, limit: 10 }, signal),
    ).resolves.toEqual(response);
    expect(api.get).toHaveBeenCalledWith('/movies/favorites', {
      params: { page: 2, limit: 10 },
      signal,
    });
  });
});
