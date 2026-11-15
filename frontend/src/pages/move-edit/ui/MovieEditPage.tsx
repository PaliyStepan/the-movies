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
} from '@mantine/core';
import { ERoutes, movieDetailPath } from '@/shared/config/routes';
import { useAuthStore } from '@/shared/auth/auth.store';
import { getMovieById } from '@/entities/movie/api/movies.api';
import { useUpdateMovie } from '@/entities/movie/model/use-update-movie';
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
  description: z
    .string()
    .max(3000, 'Максимум 3000 символов')
    .optional(),
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

  return (
    <Stack maw={800} mx="auto" gap="md">
      <Anchor component={Link} to={movieDetailPath(movie.id)} size="sm">
        ← Вернуться к фильму
      </Anchor>
      <Title order={2}>Редактировать фильм</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Название"
            placeholder="Например, Интерстеллар"
            error={errors.title?.message}
            maxLength={200}
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
            error={errors.description?.message}
            {...register('description')}
          />

          <TextInput
            label="Оригинальное название"
            placeholder="Interstellar"
            maxLength={200}
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
            label="Ссылка на постер"
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

          <Text ta="center" size="sm" c="dimmed">
            <Anchor component={Link} to={movieDetailPath(movie.id)} size="sm">
              Вернуться к фильму
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Stack>
  );
}
