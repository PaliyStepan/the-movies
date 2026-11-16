import {Link, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {
  Anchor,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {useAuthStore} from '@/shared/auth/auth.store';
import {getMovieById} from '@/entities/movie/api/movies.api';
import {useReviews} from '@/entities/review/model/use-reviews';
import {
  movieDetailPath,
  reviewCreatePath,
  reviewDetailPath,
} from '@/shared/config/routes';

export function ReviewsListPage() {
  const {movieId} = useParams<{ movieId: string }>();
  const user = useAuthStore((s) => s.user);

  const {data: movie} = useQuery({
    queryKey: ['movie', movieId],
    queryFn: ({signal}) => getMovieById(movieId!, signal),
    enabled: !!movieId,
  });

  const {data: reviews, isPending} = useReviews(movieId!);

  if (isPending) {
    return (
      <Center py="xl">
        <Loader/>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Anchor component={Link} to={movieDetailPath(movieId!)} size="sm">
        ← Вернуться к фильму
      </Anchor>

      <Group justify="space-between">
        <Title order={2}>
          Отзывы{movie ? ` к фильму «${movie.title}»` : ''}
        </Title>
        {user && (
          <Button component={Link} to={reviewCreatePath(movieId!)}>
            Оставить отзыв
          </Button>
        )}
      </Group>

      {!reviews || reviews.length === 0 ? (
        <Text c="dimmed">
          {user
            ? 'Пока нет отзывов. Будьте первым!'
            : 'Пока нет отзывов. Зарегистрируйтесь или войдите, чтобы оставить первый отзыв.'}
        </Text>
      ) : (
        <Stack gap="sm">
          {reviews.map((review) => (
            <Card
              key={review.id}
              component={Link}
              to={reviewDetailPath(review.id)}
              withBorder
              padding="md"
              style={{textDecoration: 'none'}}
            >
              <Stack gap="xs">
                {review.title && (
                  <Text fw={600} size="sm" c="dimmed">
                    «{review.title}»
                  </Text>
                )}
                <Text lineClamp={3}>{review.description}</Text>
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    {review.user.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
