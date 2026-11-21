import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  user: { id: 'user-1' } as { id: string } | null,
  movie: {
    id: 'movie-1',
    title: 'Alien',
    originalTitle: null,
    year: 1979,
    tmdbRating: 8.5,
    voteCount: 100,
    originalLanguage: 'en',
    createdById: null,
    description: 'A science-fiction film.',
    genreIds: [18],
    reviewsCount: 2,
  },
  favoriteStatus: { isFavorite: false },
  recommendations: [{ id: 'movie-2', title: 'Aliens', posterPath: null }],
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  invalidateQueries: vi.fn(),
  getMovieById: vi.fn(),
  getMovieFavoriteStatus: vi.fn(),
  getMovieRecommendations: vi.fn(),
  addMovieToFavorites: vi.fn(),
  removeMovieFromFavorites: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  Link: ({
    children,
    to,
  }: {
    children: React.ReactNode;
    to: string;
  }) => <a href={to}>{children}</a>,
  useParams: () => ({ id: 'movie-1' }),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: mocks.useQuery,
  useMutation: mocks.useMutation,
  useQueryClient: () => ({ invalidateQueries: mocks.invalidateQueries }),
}));

vi.mock('@/entities/movie', () => ({
  addMovieToFavorites: mocks.addMovieToFavorites,
  getMovieById: mocks.getMovieById,
  getMovieFavoriteStatus: mocks.getMovieFavoriteStatus,
  getMovieRecommendations: mocks.getMovieRecommendations,
  removeMovieFromFavorites: mocks.removeMovieFromFavorites,
}));

vi.mock('@/entities/movie/lib/poster', () => ({
  getBackdropUrl: () => null,
  getPosterUrl: () => '/poster.jpg',
}));

vi.mock('@/entities/movie/lib/genres', () => ({
  GENRE_NAMES: { 18: 'Драма' },
}));

vi.mock('@/shared/auth/auth.store', () => ({
  useAuthStore: (selector: (state: { user: typeof mocks.user }) => unknown) =>
    selector({ user: mocks.user }),
}));

vi.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('swiper/modules', () => ({
  Navigation: {},
  Pagination: {},
}));

vi.mock('@mantine/core', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Grid = Object.assign(Wrapper, { Col: Wrapper });

  return {
    Alert: ({
      title,
      children,
    }: {
      title?: string;
      children: React.ReactNode;
    }) => <div role="alert">{title}{children}</div>,
    Anchor: ({
      children,
      component: Component,
      to,
      ...props
    }: {
      children: React.ReactNode;
      component: React.ElementType;
      to: string;
    }) => <Component to={to} {...props}>{children}</Component>,
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Button: ({
      children,
      onClick,
      disabled,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
    }) => <button onClick={onClick} disabled={disabled}>{children}</button>,
    Card: ({
      children,
      component: Component,
      to,
    }: {
      children: React.ReactNode;
      component?: React.ElementType;
      to?: string;
    }) => Component ? <Component to={to}>{children}</Component> : <div>{children}</div>,
    Center: Wrapper,
    Container: Wrapper,
    Divider: () => <hr />,
    Grid,
    Group: Wrapper,
    Image: ({ alt, src }: { alt: string; src?: string }) => <img alt={alt} src={src} />,
    Loader: () => <div role="status" />,
    Text: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
    Title: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  };
});

import { MovieDetailPage } from './MovieDetailPage';

describe('MovieDetailPage', () => {
  beforeEach(() => {
    mocks.user = { id: 'user-1' };
    mocks.favoriteStatus = { isFavorite: false };
    mocks.useQuery.mockImplementation(
      ({ queryKey }: { queryKey: (string | undefined)[] }) => {
        switch (queryKey[0]) {
          case 'movie':
            return { data: mocks.movie, isPending: false, isError: false };
          case 'movie-favorite':
            return {
              data: mocks.favoriteStatus,
              isPending: false,
              isError: false,
            };
          default:
            return {
              data: mocks.recommendations,
              isPending: false,
              isError: false,
            };
        }
      },
    );
    mocks.useMutation.mockImplementation((options) => ({
      isPending: false,
      isError: false,
      mutate: (variables: boolean) =>
        Promise.resolve(options.mutationFn(variables)).then(options.onSuccess),
    }));
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders movie details and recommendations', () => {
    render(<MovieDetailPage />);

    expect(screen.getByRole('heading', { name: 'Alien' })).toBeInTheDocument();
    expect(screen.getByText('Aliens')).toBeInTheDocument();
    expect(screen.getByText('Драма')).toBeInTheDocument();
  });

  it('adds a movie to favorites when it is not already saved', async () => {
    render(<MovieDetailPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Добавить в избранное' }));

    await waitFor(() => {
      expect(mocks.addMovieToFavorites).toHaveBeenCalledWith('movie-1');
      expect(mocks.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['my-favorites'],
      });
    });
  });

  it('removes a saved movie from favorites', async () => {
    mocks.favoriteStatus = { isFavorite: true };
    render(<MovieDetailPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Удалить из избранных' }));

    await waitFor(() => {
      expect(mocks.removeMovieFromFavorites).toHaveBeenCalledWith('movie-1');
    });
  });

  it('does not offer favorite actions to a guest', () => {
    mocks.user = null;
    render(<MovieDetailPage />);

    expect(screen.queryByRole('button', { name: /избранное/i })).not.toBeInTheDocument();
  });
});
