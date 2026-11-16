import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import {
  Alert,
  Anchor,
  Button,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useCreateReview } from '@/entities/review/model/use-create-review';
import { movieDetailPath } from '@/shared/config/routes';

const createReviewSchema = z.object({
  title: z.string().max(200, 'Максимум 200 символов').optional(),
  description: z
    .string()
    .min(1, 'Введите текст отзыва')
    .max(5000, 'Максимум 5000 символов'),
});

type CreateReviewFormValues = z.infer<typeof createReviewSchema>;

export function ReviewCreatePage() {
  const { movieId } = useParams<{ movieId: string }>();
  const createMutation = useCreateReview(movieId!);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReviewFormValues>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = (data: CreateReviewFormValues) => {
    createMutation.mutate({
      title: data.title || undefined,
      description: data.description,
    });
  };

  return (
    <Stack maw={600} mx="auto" gap="md">
      <Anchor component={Link} to={movieDetailPath(movieId!)} size="sm">
        ← Вернуться к фильму
      </Anchor>

      <Title order={2}>Оставить отзыв</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Цитата"
            placeholder="Короткая фраза, которая цепляет (необязательно)"
            maxLength={200}
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label="Отзыв"
            placeholder="Поделитесь впечатлениями о фильме"
            minRows={6}
            maxLength={5000}
            withAsterisk
            error={errors.description?.message}
            {...register('description')}
          />

          {createMutation.isError && (
            <Alert color="red" variant="light">
              Не удалось создать отзыв. Возможно, вы уже оставляли отзыв на этот
              фильм.
            </Alert>
          )}

          <Button type="submit" fullWidth loading={createMutation.isPending}>
            Опубликовать
          </Button>

          <Text ta="center" size="sm" c="dimmed">
            <Anchor component={Link} to={movieDetailPath(movieId!)} size="sm">
              Вернуться к фильму
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Stack>
  );
}
