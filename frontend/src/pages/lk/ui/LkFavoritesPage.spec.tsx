import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useQuery: vi.fn(),
  setSearchParams: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-query')>();

  return { ...actual, useQuery: mocks.useQuery };
});

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useSearchParams: () => [mocks.searchParams, mocks.setSearchParams],
}));

vi.mock('@/entities/movie', () => ({
  MovieCard: ({ movie }: { movie: { title: string } }) => (
    <article>{movie.title}</article>
  ),
}));

vi.mock('@mantine/core', () => ({
  Anchor: ({
    children,
    component: Component,
    to,
  }: {
    children: React.ReactNode;
    component: React.ElementType;
    to: string;
  }) => <Component to={to}>{children}</Component>,
  Center: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Group: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Loader: () => <div role="status" />,
  Pagination: ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (page: number) => void;
  }) => <button onClick={() => onChange(value + 1)}>Следующая страница</button>,
  SimpleGrid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  Title: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
}));

import { LkFavoritesPage } from './LkFavoritesPage';

describe('LkFavoritesPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders the favorite movies and pagination', () => {
    mocks.useQuery.mockReturnValue({
      data: {
        items: [{ id: 'movie-1', title: 'Alien' }],
        total: 11,
        page: 1,
        limit: 10,
        totalPages: 2,
      },
      isPending: false,
      isError: false,
    });

    render(<LkFavoritesPage />);

    expect(screen.getByText('Alien')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Следующая страница' }));
    const updatedParams = mocks.setSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(updatedParams.get('page')).toBe('2');
  });

  it('shows an empty state and link to the catalog', () => {
    mocks.useQuery.mockReturnValue({
      data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
      isPending: false,
      isError: false,
    });

    render(<LkFavoritesPage />);

    expect(screen.getByText(/В избранном пока нет фильмов/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Перейти к фильмам' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('shows an explicit error when favorites cannot be loaded', () => {
    mocks.useQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    });

    render(<LkFavoritesPage />);

    expect(
      screen.getByText('Не удалось загрузить избранные фильмы.'),
    ).toBeInTheDocument();
  });
});
