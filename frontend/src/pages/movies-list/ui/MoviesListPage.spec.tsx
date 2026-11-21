import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useMovies: vi.fn(),
  setSearchParams: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [mocks.searchParams, mocks.setSearchParams],
}));

vi.mock('@mantine/hooks', () => ({
  useDebouncedValue: (value: string) => [value],
}));

vi.mock('@/entities/movie', () => ({
  MovieCard: ({ movie }: { movie: { title: string } }) => (
    <article>{movie.title}</article>
  ),
  useMovies: mocks.useMovies,
}));

vi.mock('@mantine/core', () => ({
  Center: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CloseButton: ({ onClick }: { onClick: () => void }) => (
    <button aria-label="Очистить поиск" onClick={onClick} />
  ),
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
  TextInput: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  }) => <input value={value} onChange={onChange} placeholder={placeholder} />,
  Title: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

import { MoviesListPage } from './MoviesListPage';

describe('MoviesListPage', () => {
  beforeEach(() => {
    mocks.searchParams = new URLSearchParams();
    mocks.useMovies.mockReturnValue({
      data: { items: [], total: 0, page: 1, limit: 20, totalPages: 0 },
      isPending: false,
      isFetching: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows a validation hint for a search shorter than three characters', () => {
    render(<MoviesListPage />);

    fireEvent.change(screen.getByPlaceholderText(/Поиск фильмов/), {
      target: { value: 'ab' },
    });

    expect(screen.getByText('Введите минимум 3 символа для поиска')).toBeInTheDocument();
    expect(mocks.useMovies).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'ab' }),
    );
  });

  it('renders movie results and updates the URL when changing pages', () => {
    mocks.searchParams = new URLSearchParams('search=alien&page=1');
    mocks.useMovies.mockReturnValue({
      data: {
        items: [{ id: 'movie-1', title: 'Alien' }],
        total: 21,
        page: 1,
        limit: 20,
        totalPages: 2,
      },
      isPending: false,
      isFetching: false,
    });

    render(<MoviesListPage />);

    expect(screen.getByText('Alien')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Следующая страница' }));

    expect(mocks.setSearchParams).toHaveBeenCalledWith(
      expect.objectContaining({
        get: expect.any(Function),
      }),
    );
    const updatedParams = mocks.setSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(updatedParams.get('search')).toBe('alien');
    expect(updatedParams.get('page')).toBe('2');
  });

  it('shows the empty state when the search has no results', () => {
    mocks.useMovies.mockReturnValue({
      data: { items: [], total: 0, page: 1, limit: 20, totalPages: 0 },
      isPending: false,
      isFetching: false,
    });

    render(<MoviesListPage />);

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
  });
});
