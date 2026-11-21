import { Link, useSearchParams } from 'react-router-dom';
import {
  Anchor,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useMyReviews } from '@/entities/review/model/use-my-reviews';
import { reviewDetailPath, movieDetailPath } from '@/shared/config/routes';

const LIMIT = 10;

export function LkReviewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');

  const { data, isPending } = useMyReviews({ page, limit: LIMIT });

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
      <Title order={3}>Мои отзывы</Title>

      {!data || data.items.length === 0 ? (
        <Text c="dimmed">
          Вы ещё не оставили ни одного отзыва.{' '}
          <Anchor component={Link} to="/">
            Перейти к фильмам
          </Anchor>
        </Text>
      ) : (
        <Stack gap="sm">
          {data.items.map((review) => (
            <Card
              key={review.id}
              withBorder
              padding="md"
            >
              <Stack gap="xs">
                {review.title && (
                  <Text fw={600} size="sm" c="dimmed">
                    «{review.title}»
                  </Text>
                )}
                <Text lineClamp={3}>{review.description}</Text>
                <Group justify="space-between">
                  <Anchor
                    component={Link}
                    to={movieDetailPath(review.movieId)}
                    size="xs"
                  >
                    К фильму
                  </Anchor>
                  <Group gap="md">
                    <Text size="xs" c="dimmed">
                      {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                    </Text>
                    <Anchor
                      component={Link}
                      to={reviewDetailPath(review.id)}
                      size="xs"
                    >
                      Открыть
                    </Anchor>
                  </Group>
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>
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
