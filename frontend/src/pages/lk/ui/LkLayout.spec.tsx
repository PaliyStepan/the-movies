import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ERoutes } from '@/shared/config/routes';

const mocks = vi.hoisted(() => ({
  useMyReviews: vi.fn(),
  useMyMovies: vi.fn(),
  useQuery: vi.fn(),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-query')>();

  return { ...actual, useQuery: mocks.useQuery };
});

vi.mock('@/entities/movie/model/use-my-movies', () => ({
  useMyMovies: mocks.useMyMovies,
}));

vi.mock('@/entities/review/model/use-my-reviews', () => ({
  useMyReviews: mocks.useMyReviews,
}));

vi.mock('@mantine/core', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="counter">{children}</span>
  ),
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Grid: Object.assign(
    ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    {
      Col: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    },
  ),
  Paper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Title: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  NavLink: ({
    to,
    label,
    rightSection,
  }: {
    to: string;
    label: string;
    rightSection?: React.ReactNode;
  }) => (
    <a href={to}>
      {label}
      {rightSection}
    </a>
  ),
}));

vi.mock('react-router-dom', () => ({
  NavLink: () => null,
  Outlet: () => <div data-testid="outlet" />,
}));

import { LkLayout } from './LkLayout';

describe('LkLayout', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows review, movie and favorite totals beside their menu links', () => {
    mocks.useMyReviews.mockReturnValue({ data: { total: 4 } });
    mocks.useMyMovies.mockReturnValue({ data: { total: 2 } });
    mocks.useQuery.mockReturnValue({ data: { total: 7 } });

    render(<LkLayout />);

    expect(screen.getByRole('link', { name: /Ревью/ })).toHaveAttribute(
      'href',
      ERoutes.LK_REVIEWS,
    );
    expect(screen.getAllByTestId('counter').map((counter) => counter.textContent)).toEqual([
      '4',
      '2',
      '7',
    ]);
  });

  it('does not show counters before count queries have loaded', () => {
    mocks.useMyReviews.mockReturnValue({
      data: { total: 4 },
      isPending: false,
    });
    mocks.useMyMovies.mockReturnValue({
      data: { total: 2 },
      isPending: false,
    });
    mocks.useQuery.mockReturnValue({ data: undefined, isPending: true });

    const { rerender } = render(<LkLayout />);

    expect(screen.queryByTestId('counter')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Избранное' })).toHaveAttribute(
      'href',
      ERoutes.LK_FAVORITES,
    );

    mocks.useQuery.mockReturnValue({
      data: { total: 7 },
      isPending: false,
    });
    rerender(<LkLayout />);

    expect(screen.getAllByTestId('counter').map((counter) => counter.textContent)).toEqual([
      '4',
      '2',
      '7',
    ]);
  });
});
