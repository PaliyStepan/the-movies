import { NavLink, Outlet } from 'react-router-dom';
import {
  Badge,
  Container,
  Grid,
  NavLink as MantineNavLink,
  Paper,
  Stack,
  Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useMyMovies } from '@/entities/movie/model/use-my-movies';
import { getMyFavoriteMovies } from '@/entities/movie/api/movies.api';
import { useMyReviews } from '@/entities/review/model/use-my-reviews';
import { ERoutes } from '@/shared/config/routes';

type LkMenuCountKey = 'reviews' | 'movies' | 'favorites';

type LkMenuItem = {
  label: string;
  to: string;
  end: boolean;
  countKey?: LkMenuCountKey;
};

const menuItems: LkMenuItem[] = [
  { label: 'Общая информация', to: ERoutes.LK, end: true },
  {
    label: 'Ревью',
    to: ERoutes.LK_REVIEWS,
    end: false,
    countKey: 'reviews',
  },
  {
    label: 'Фильмы',
    to: ERoutes.LK_MOVIES,
    end: false,
    countKey: 'movies',
  },
  {
    label: 'Избранное',
    to: ERoutes.LK_FAVORITES,
    end: false,
    countKey: 'favorites',
  },
];

export function LkLayout() {
  const { data: reviews, isPending: reviewsPending } = useMyReviews({
    page: 1,
    limit: 1,
  });
  const { data: movies, isPending: moviesPending } = useMyMovies({
    page: 1,
    limit: 1,
  });
  const { data: favorites, isPending: favoritesPending } = useQuery({
    queryKey: ['my-favorites', 1, 1],
    queryFn: ({ signal }) =>
      getMyFavoriteMovies({ page: 1, limit: 1 }, signal),
  });
  const countsPending = reviewsPending || moviesPending || favoritesPending;

  const counts: Record<LkMenuCountKey, number | undefined> = {
    reviews: reviews?.total,
    movies: movies?.total,
    favorites: favorites?.total,
  };

  return (
    <Container size="lg" py="md">
      <Title order={2} mb="md">
        Личный кабинет
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="xs">
            <Stack gap={4}>
              {menuItems.map((item) => (
                <MantineNavLink
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  end={item.end}
                  label={item.label}
                  rightSection={
                    item.countKey &&
                    !countsPending &&
                    (counts[item.countKey] ?? 0) > 0 && (
                      <Badge size="sm" variant="filled">
                        {counts[item.countKey]}
                      </Badge>
                    )
                  }
                />
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
