import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  useReviews: vi.fn(),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-query')>();

  return { ...actual, useQuery: mocks.useQuery };
});

vi.mock('@/entities/review/model/use-reviews', () => ({
  useReviews: mocks.useReviews,
}));

vi.mock('@/entities/movie/api/movies.api', () => ({
  getMovieById: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useParams: () => ({ movieId: 'movie-1' }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

vi.mock('@mantine/core', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Card = ({
    children,
    component: Component,
    to,
  }: {
    children: React.ReactNode;
    component: React.ElementType;
    to: string;
  }) => <Component to={to}>{children}</Component>;

  return {
    Anchor: ({
      children,
      component: Component,
      to,
    }: {
      children: React.ReactNode;
      component: React.ElementType;
      to: string;
    }) => <Component to={to}>{children}</Component>,
    Button: ({
      children,
      component: Component,
      to,
    }: {
      children: React.ReactNode;
      component: React.ElementType;
      to: string;
    }) => <Component to={to}>{children}</Component>,
    Card,
    Center: Wrapper,
    Group: Wrapper,
    Loader: () => <div role="status" />,
    Pagination: () => <div data-testid="pagination" />,
    Stack: Wrapper,
    Text: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
    Title: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  };
});

import { ReviewsListPage } from './ReviewsListPage';

describe('ReviewsListPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders reviews with movie title, author and pagination', () => {
    mocks.useQuery.mockReturnValue({ data: { title: 'Alien' } });
    mocks.useReviews.mockReturnValue({
      isPending: false,
      data: {
        items: [
          {
            id: 'review-1',
            movieId: 'movie-1',
            title: 'A classic',
            description: 'Still scary.',
            user: { name: 'Alex' },
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        total: 11,
        page: 1,
        limit: 10,
        totalPages: 2,
      },
    });

    render(<ReviewsListPage />);

    expect(screen.getByRole('heading', { name: 'Отзывы к фильму «Alien»' })).toBeInTheDocument();
    expect(screen.getByText('«A classic»')).toBeInTheDocument();
    expect(screen.getByText('Still scary.')).toBeInTheDocument();
    expect(screen.getByText('Alex')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('shows a message when the movie has no reviews', () => {
    mocks.useQuery.mockReturnValue({ data: undefined });
    mocks.useReviews.mockReturnValue({
      isPending: false,
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    });

    render(<ReviewsListPage />);

    expect(screen.getByText('Пока нет отзывов. Будьте первым!')).toBeInTheDocument();
  });
});
