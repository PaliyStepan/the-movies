import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Link} from 'react-router-dom';
import {z} from 'zod';
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
  ActionIcon,
  Tooltip
} from '@mantine/core';
import {ERoutes} from '@/shared/config/routes';
import {useCreateMovie} from '@/entities/movie/model/use-create-movie';
import {GENRE_NAMES} from '@/entities/movie/lib/genres';

const currentYear = new Date().getFullYear();

const createMovieSchema = z.object({
  title: z.string().min(1, 'Введите название').max(200, 'Максимум 200 символов'),
  year: z
    .number({error: 'Введите год числом'})
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
    .number({error: 'Введите рейтинг числом'})
    .min(0, 'Минимум 0')
    .max(10, 'Максимум 10')
    .optional(),
  voteCount: z
    .number({error: 'Введите число голосов'})
    .int('Должно быть целым')
    .min(0, 'Минимум 0')
    .optional(),
  genreIds: z.array(z.string()).optional(),
});

type CreateMovieFormValues = z.infer<typeof createMovieSchema>;

const genreOptions = Object.entries(GENRE_NAMES).map(([id, name]) => ({
  value: id,
  label: name,
}));

export function MovieCreatePage() {
  const createMutation = useCreateMovie();

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<CreateMovieFormValues>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: {
      title: '',
      description: '',
      originalTitle: '',
      originalLanguage: '',
      posterPath: '',
      genreIds: [],
    },
  });

  const onSubmit = (data: CreateMovieFormValues) => {
    createMutation.mutate({
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
    <Stack maw={600} mx="auto" gap="md">
      <Title order={2}>Создать фильм</Title>

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
            render={({field}) => (
              <TextInput
                label="Год"
                placeholder="2014"
                error={errors.year?.message}
                maxLength={4}
                inputMode="numeric"
                value={field.value ?? ''}
                onChange={(e) => {
                  const digits = e.currentTarget.value.replace(/\D/g, '').slice(0, 4);
                  field.onChange(digits === '' ? undefined : Number(digits));
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
            maxLength={200}
            error={errors.originalTitle?.message}
            {...register('originalTitle')}
          />

          <TextInput
            label="Язык оригинала"
            maxLength={3}
            placeholder="en"
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
            render={({field}) => (
              <NumberInput
                label="Рейтинг TMDB"
                placeholder="8.7"
                min={0}
                max={10}
                step={0.1}
                hideControls
                clampBehavior="strict"
                decimalScale={1}
                error={errors.tmdbRating?.message}
                value={field.value}
                onChange={(value) => {
                  if (typeof value === 'number') {
                    field.onChange(Math.round(value * 10) / 10);
                  } else {
                    field.onChange(undefined);
                  }
                }}
              />
            )}
          />

          <Controller
            name="voteCount"
            control={control}
            render={({field}) => (
              <NumberInput
                label="Количество голосов"
                placeholder="29843"
                min={0}
                error={errors.voteCount?.message}
                hideControls
                allowDecimal={false}
                allowNegative={false}
                value={field.value}
                onChange={(value) => field.onChange(typeof value === 'number' ? value : undefined)}
              />
            )}
          />

          <Controller
            name="genreIds"
            control={control}
            render={({field}) => (
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

          {createMutation.isError && (
            <Alert color="red" variant="light">
              Не удалось создать фильм. Проверьте данные и попробуйте снова.
            </Alert>
          )}

          <Button type="submit" fullWidth loading={createMutation.isPending}>
            Создать фильм
          </Button>

          <Text ta="center" size="sm" c="dimmed">
            <Anchor component={Link} to={ERoutes.HOME} size="sm">
              Вернуться к списку фильмов
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Stack>
  );
}
