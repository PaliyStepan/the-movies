import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Stack,
  Title,
  Text,
  Anchor,
  MultiSelect,
  Alert,
  Center,
  Loader,
  Group, Tooltip, ActionIcon,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { ERoutes, movieDetailPath } from '@/shared/config/routes';
import { useAuthStore } from '@/shared/auth/auth.store';
import { getMovieById } from '@/entities/movie/api/movies.api';
import { useUpdateMovie } from '@/entities/movie/model/use-update-movie';
import { useDeleteMovie } from '@/entities/movie/model/use-delete-movie';
import { GENRE_NAMES } from '@/entities/movie/lib/genres';

const currentYear = new Date().getFullYear();

const editMovieSchema = z.object({
  title: z.string().min(1, 'Введите название').max(200, 'Максимум 200 символов'),
  year: z
    .number({ error: 'Введите год числом' })
    .int('Год должен быть целым')
    .min(1888, 'Минимум 1888')
    .max(currentYear + 5, `Максимум ${currentYear + 5}`)
    .optional(),
  description: z.string().max(5000, 'Максимум 5000 символов').optional(),
  originalTitle: z.string().max(200, 'Максимум 200 символов').optional(),
  originalLanguage: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(3, 'Максимум 3 символа')
    .optional()
    .or(z.literal('')),
  posterPath: z
    .string()
    .url('Введите корректный URL')
    .optional()
    .or(z.literal('')),
  tmdbRating: z
    .number({ error: 'Введите рейтинг числом' })
    .min(0, 'Минимум 0')
    .max(10, 'Максимум 10')
    .optional(),
  voteCount: z
    .number({ error: 'Введите число голосов' })
    .int('Должно быть целым')
    .min(0, 'Минимум 0')
    .optional(),
  genreIds: z.array(z.string()).optional(),
});

type EditMovieFormValues = z.infer<typeof editMovieSchema>;

const genreOptions = Object.entries(GENRE_NAMES).map(([id, name]) => ({
  value: id,
  label: name,
}));

export function MovieEditPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const { data: movie, isPending, isError } = useQuery({
    queryKey: ['movie', id],
    queryFn: ({ signal }) => getMovieById(id!, signal),
    enabled: !!id,
  });

  const updateMutation = useUpdateMovie(id!);
  const deleteMutation = useDeleteMovie(id!);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditMovieFormValues>({
    resolver: zodResolver(editMovieSchema),
  });

  useEffect(() => {
    if (movie) {
      reset({
        title: movie.title,
        year: movie.year ?? undefined,
        description: movie.description ?? '',
        originalTitle: movie.originalTitle ?? '',
        originalLanguage: movie.originalLanguage ?? '',
        posterPath: movie.posterPath ?? '',
        tmdbRating: movie.tmdbRating ?? undefined,
        voteCount: movie.voteCount ?? undefined,
        genreIds: movie.genreIds.map(String),
      });
    }
  }, [movie, reset]);

  if (isPending) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError || !movie) {
    return (
      <Alert color="red" title="Ошибка">
        Фильм не найден.{' '}
        <Anchor component={Link} to={ERoutes.HOME}>
          Вернуться к списку
        </Anchor>
      </Alert>
    );
  }

  if (movie.createdById !== user?.id) {
    return (
      <Alert color="yellow" title="Нет доступа">
        Вы не можете редактировать этот фильм.{' '}
        <Anchor component={Link} to={movieDetailPath(movie.id)}>
          Вернуться к фильму
        </Anchor>
      </Alert>
    );
  }

  const onSubmit = (data: EditMovieFormValues) => {
    updateMutation.mutate({
      title: data.title,
      year: data.year,
      description: data.description || undefined,
      originalTitle: data.originalTitle || undefined,
      originalLanguage: data.originalLanguage || undefined,
      posterPath: data.posterPath || undefined,
      tmdbRating: data.tmdbRating,
      voteCount: data.voteCount,
      genreIds: data.genreIds?.map(Number) ?? [],
    });
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Удалить фильм?',
      children: <Text size="sm">Это действие нельзя отменить.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteMutation.mutate(),
    });
  };

  return (
    <Stack maw={600} mx="auto" gap="md">
      <Anchor component={Link} to={movieDetailPath(movie.id)} size="sm">
        ← Вернуться к фильму
      </Anchor>

      <Group justify="space-between" align="center">
        <Title order={2}>Редактировать фильм</Title>
        <Button
          color="red"
          variant="light"
          onClick={handleDelete}
          loading={deleteMutation.isPending}
        >
          Удалить фильм
        </Button>
      </Group>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Название"
            placeholder="Например, Интерстеллар"
            error={errors.title?.message}
            withAsterisk
            {...register('title')}
          />

          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Год"
                placeholder="2014"
                error={errors.year?.message}
                hideControls
                allowDecimal={false}
                allowNegative={false}
                value={field.value}
                onChange={(value) => {
                  if (value === '' || value === undefined) {
                    field.onChange(undefined);
                    return;
                  }
                  const num = typeof value === 'number' ? value : Number(value);
                  if (!Number.isNaN(num)) {
                    field.onChange(num);
                  }
                }}
              />
            )}
          />

          <Textarea
            label="Описание"
            placeholder="Краткое описание фильма"
            maxLength={3000}
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

          <TextInput
            label="Оригинальное название"
            placeholder="Interstellar"
            error={errors.originalTitle?.message}
            {...register('originalTitle')}
          />

          <TextInput
            label="Язык оригинала"
            placeholder="en"
            maxLength={3}
            error={errors.originalLanguage?.message}
            {...register('originalLanguage')}
          />

          <TextInput
            label={
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
              Ссылка на постер
              <Tooltip
                label="В рамках пет-проекта загрузка изображений не реализована. Пожалуйста, вставьте ссылку на картинку."
                withArrow
                multiline
                w={280}
                events={{hover: true, focus: true, touch: true}}
              >
                <ActionIcon
                  variant="transparent"
                  size="sm"
                  aria-label="Информация о ссылке на постер"
                >
                   <svg
                     width="16"
                     height="16"
                     viewBox="0 0 24 24"
                     fill="none"
                     aria-hidden="true"
                   >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="8" r="1" fill="currentColor" />
                    <path
                      d="M12 11.5V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </ActionIcon>
              </Tooltip>
            </span>
            }
            placeholder="https://example.com/poster.jpg"
            error={errors.posterPath?.message}
            {...register('posterPath')}
          />

          <Controller
            name="tmdbRating"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Рейтинг TMDB"
                placeholder="8.7"
                min={0}
                max={10}
                step={0.1}
                hideControls
                decimalScale={1}
                error={errors.tmdbRating?.message}
                value={field.value}
                onChange={(value) =>
                  field.onChange(typeof value === 'number' ? value : undefined)
                }
              />
            )}
          />

          <Controller
            name="voteCount"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Количество голосов"
                placeholder="29843"
                min={0}
                hideControls
                allowDecimal={false}
                allowNegative={false}
                error={errors.voteCount?.message}
                value={field.value}
                onChange={(value) =>
                  field.onChange(typeof value === 'number' ? value : undefined)
                }
              />
            )}
          />

          <Controller
            name="genreIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Жанры"
                placeholder="Выберите жанры"
                data={genreOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.genreIds?.message}
                searchable
                clearable
              />
            )}
          />

          {updateMutation.isError && (
            <Alert color="red" variant="light">
              Не удалось обновить фильм. Проверьте данные и попробуйте снова.
            </Alert>
          )}

          <Button type="submit" fullWidth loading={updateMutation.isPending}>
            Сохранить изменения
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
