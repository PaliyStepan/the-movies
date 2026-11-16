import { Link, useParams } from 'react-router-dom';
import { modals } from '@mantine/modals';
import {
  Alert,
  Anchor,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useAuthStore } from '@/shared/auth/auth.store';
import { useReview } from '@/entities/review/model/use-reviews';
import { useDeleteReview } from '@/entities/review/model/use-delete-review';
import {
  movieDetailPath,
  reviewEditPath,
  reviewsListPath,
} from '@/shared/config/routes';

export function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const { data: review, isPending, isError } = useReview(id!);
  const deleteMutation = useDeleteReview(id!, review?.movieId ?? '');

  if (isPending) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError || !review) {
    return (
      <Alert color="red" title="Ошибка">
        Отзыв не найден.
      </Alert>
    );
  }

  const isAuthor = user && review.userId === user.id;

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Удалить отзыв?',
      children: <Text size="sm">Это действие нельзя отменить.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(),
    });
  };

  return (
    <Stack gap="md" maw={800} mx="auto">
      <Group gap="md">
        <Anchor component={Link} to={movieDetailPath(review.movieId)} size="sm">
          ← Вернуться к фильму
        </Anchor>
        <Anchor component={Link} to={reviewsListPath(review.movieId)} size="sm">
          ← Все отзывы
        </Anchor>
      </Group>

      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>Отзыв</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {review.user.name} ·{' '}
            {new Date(review.createdAt).toLocaleDateString('ru-RU')}
          </Text>
        </div>
        {isAuthor && (
          <Group gap="xs">
            <Button
              component={Link}
              to={reviewEditPath(review.id)}
              variant="light"
            >
              Редактировать
            </Button>
            <Button
              color="red"
              variant="light"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              Удалить
            </Button>
          </Group>
        )}
      </Group>

      {review.title && (
        <Text fw={600} size="lg" c="dimmed">
          «{review.title}»
        </Text>
      )}
      <Text style={{ whiteSpace: 'pre-wrap' }}>{review.description}</Text>
    </Stack>
  );
}
