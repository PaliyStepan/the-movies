import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  Link: ({
    children,
    to,
  }: {
    children: React.ReactNode;
    to: string;
  }) => <a href={to}>{children}</a>,
}));

vi.mock('@/entities/movie/lib/poster', () => ({
  getPosterUrl: () => 'https://images.example/poster.jpg',
}));

vi.mock('@mantine/core', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Card = Object.assign(
    ({
      children,
      component: Component,
      to,
    }: {
      children: React.ReactNode;
      component: React.ElementType;
      to: string;
    }) => <Component to={to}>{children}</Component>,
    {
      Section: Wrapper,
    },
  );

  return {
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Card,
    Group: Wrapper,
    Image: ({ alt, src }: { alt: string; src?: string }) => <img alt={alt} src={src} />,
    Text: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  };
});

import { MovieCard } from './MovieCard';

const createMovie = (overrides: { id: string; title: string; year: number | null; tmdbRating: number | null }) => ({
  tmdbId: null,
  originalTitle: null,
  originalLanguage: null,
  description: null,
  posterPath: '/poster.jpg',
  backdropPath: null,
  voteCount: null,
  genreIds: [],
  createdById: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('MovieCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('links to the movie detail and shows its title, year and rating', () => {
    render(
      <MovieCard
        movie={createMovie({
          id: 'movie-1',
          title: 'Alien',
          tmdbRating: 8.5,
          year: 1979,
        })}
      />,
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/movies/movie-1');
    expect(screen.getByText('Alien')).toBeInTheDocument();
    expect(screen.getByText('1979')).toBeInTheDocument();
    expect(screen.getByText('★ 8.5')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Alien' })).toHaveAttribute(
      'src',
      'https://images.example/poster.jpg',
    );
  });

  it('omits year and rating when they are unavailable', () => {
    render(
      <MovieCard
        movie={createMovie({
          id: 'movie-2',
          title: 'Untitled',
          tmdbRating: null,
          year: null,
        })}
      />,
    );

    expect(screen.getByText('Untitled')).toBeInTheDocument();
    expect(screen.queryByText(/★/)).not.toBeInTheDocument();
  });
});
