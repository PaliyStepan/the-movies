import { Link, useSearchParams } from 'react-router-dom';
import {
  Anchor,
  Card,
  Center,
  Group,
  Image,
  Loader,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useMyMovies } from '@/entities/movie/model/use-my-movies';
import { getPosterUrl } from '@/entities/movie/lib/poster';
import { movieDetailPath, movieEditPath } from '@/shared/config/routes';

const LIMIT = 10;

export function LkMoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');

  const { data, isPending } = useMyMovies({ page, limit: LIMIT });

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

  return (
    <Stack gap="md">
      <Title order={3}>Мои фильмы</Title>

      {!data || data.items.length === 0 ? (
        <Text c="dimmed">Вы ещё не создали ни одного фильма.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
          {data.items.map((movie) => {
            const poster = getPosterUrl(movie);
            return (
              <Card key={movie.id} withBorder padding="sm" radius="md">
                <Card.Section>
                  <Image
                    src={poster ?? undefined}
                    alt={movie.title}
                    height={200}
                    fallbackSrc="/no-photo.jpg"
                  />
                </Card.Section>

                <Stack gap="xs" mt="sm">
                  <Text fw={600} lineClamp={2}>
                    {movie.title}
                  </Text>
                  {movie.year && (
                    <Text size="xs" c="dimmed">
                      {movie.year}
                    </Text>
                  )}
                  <Group justify="space-between">
                    <Anchor
                      component={Link}
                      to={movieDetailPath(movie.id)}
                      size="xs"
                    >
                      Открыть
                    </Anchor>
                    <Anchor
                      component={Link}
                      to={movieEditPath(movie.id)}
                      size="xs"
                    >
                      Редактировать
                    </Anchor>
                  </Group>
                </Stack>
              </Card>
            );
          })}
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
