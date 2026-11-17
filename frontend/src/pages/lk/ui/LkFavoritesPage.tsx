import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Anchor,
  Center,
  Group,
  Loader,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { MovieCard } from '@/entities/movie';
import { getMyFavoriteMovies } from '@/entities/movie/api/movies.api';

const LIMIT = 10;

export function LkFavoritesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');

  const { data, isPending, isError } = useQuery({
    queryKey: ['my-favorites', page, LIMIT],
    queryFn: ({ signal }) =>
      getMyFavoriteMovies({ page, limit: LIMIT }, signal),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  if (isPending) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Stack gap="md">
        <Title order={3}>Избранные фильмы</Title>
        <Text c="red">Не удалось загрузить избранные фильмы.</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Title order={3}>Избранные фильмы</Title>

      {!data || data.items.length === 0 ? (
        <Text c="dimmed">
          В избранном пока нет фильмов.{' '}
          <Anchor component={Link} to="/">
            Перейти к фильмам
          </Anchor>
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
          {data.items.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </SimpleGrid>
      )}

      {data && data.totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={page}
            onChange={handlePageChange}
            total={data.totalPages}
          />
        </Group>
      )}
    </Stack>
  );
}
