import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  Alert,
  Anchor,
  Button,
  Center,
  Loader,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useAuthStore } from '@/shared/auth/auth.store';
import { useReview } from '@/entities/review/model/use-reviews';
import { useUpdateReview } from '@/entities/review/model/use-update-review';
import { movieDetailPath, reviewDetailPath } from '@/shared/config/routes';

const editReviewSchema = z.object({
  title: z.string().max(200, 'Максимум 200 символов').optional(),
  description: z
    .string()
    .min(1, 'Введите текст отзыва')
    .max(5000, 'Максимум 5000 символов'),
});

type EditReviewFormValues = z.infer<typeof editReviewSchema>;

export function ReviewEditPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const { data: review, isPending, isError } = useReview(id!);
  const updateMutation = useUpdateReview(id!, review?.movieId ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditReviewFormValues>({
    resolver: zodResolver(editReviewSchema),
  });

  useEffect(() => {
    if (review) {
      reset({
        title: review.title ?? '',
        description: review.description,
      });
    }
  }, [review, reset]);

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

  if (review.userId !== user?.id) {
    return (
      <Alert color="yellow" title="Нет доступа">
        Вы не можете редактировать этот отзыв.{' '}
        <Anchor component={Link} to={reviewDetailPath(review.id)}>
          Вернуться к отзыву
        </Anchor>
      </Alert>
    );
  }

  const onSubmit = (data: EditReviewFormValues) => {
    updateMutation.mutate({
      title: data.title || undefined,
      description: data.description,
    });
  };

  return (
    <Stack maw={600} mx="auto" gap="md">
      <Anchor component={Link} to={movieDetailPath(review.movieId)} size="sm">
        ← Вернуться к фильму
      </Anchor>

      <Title order={2}>Редактировать отзыв</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Цитата"
            placeholder="Короткая фраза (необязательно)"
            maxLength={200}
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label="Отзыв"
            placeholder="Текст отзыва"
            maxLength={5000}
            withAsterisk
            autosize
            minRows={3}
            minLength={8}
            styles={{
              input: {
                maxHeight: 120,
                overflowY: 'auto',
              },
            }}
            error={errors.description?.message}
            {...register('description')}
          />

          {updateMutation.isError && (
            <Alert color="red" variant="light">
              Не удалось обновить отзыв.
            </Alert>
          )}

          <Button type="submit" fullWidth loading={updateMutation.isPending}>
            Сохранить изменения
          </Button>

          <Text ta="center" size="sm" c="dimmed">
            <Anchor component={Link} to={reviewDetailPath(review.id)} size="sm">
              Вернуться к отзыву
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Stack>
  );
}
