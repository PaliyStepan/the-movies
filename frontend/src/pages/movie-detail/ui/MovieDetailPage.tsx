import {useParams, Link} from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Badge,
  Group,
  Image,
  Loader,
  Center,
  Alert,
  Anchor,
  Divider, Button,
} from '@mantine/core';
import {useQuery} from '@tanstack/react-query';
import {getMovieById} from '@/entities/movie';
import {getPosterUrl,getBackdropUrl} from '@/entities/movie/lib/poster';
import {ERoutes, movieEditPath} from '@/shared/config/routes';
import {GENRE_NAMES} from '@/entities/movie/lib/genres';
import {useAuthStore} from "@/shared/auth/auth.store.ts";
import {reviewsListPath} from '@/shared/config/routes';

export function MovieDetailPage() {
  const {id} = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const {data: movie, isPending, isError} = useQuery({
    queryKey: ['movie', id],
    queryFn: ({signal}) => getMovieById(id!, signal),
    enabled: !!id,
  });

  if (isPending) {
    return (
      <Center py="xl">
        <Loader/>
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

  const backdrop = getBackdropUrl(movie);
  const poster = getPosterUrl(movie);
  const image = backdrop ?? poster;

  return (
    <Container size="md">
      <Anchor component={Link} to={ERoutes.HOME} size="sm" mb="md" display="block">
        ← Назад к фильмам
      </Anchor>

      {backdrop && (
        <Image
          src={image}
          alt={movie.title}
          radius="md"
          mb="lg"
          h={500}
          fit="cover"
          fallbackSrc="/no-photo.jpg"
          style={{ objectPosition: 'top' }}
        />
      )}

      <Title order={1} mb="xs">
        {movie.title}
      </Title>

      {movie.originalTitle && movie.originalTitle !== movie.title && (
        <Text c="dimmed" size="sm" mb="sm">
          {movie.originalTitle}
        </Text>
      )}

      <Group gap="xs" mb="md">
        {movie.year && <Badge variant="light">{movie.year}</Badge>}
        {movie.tmdbRating != null && (
          <Badge color="yellow" variant="light">
            ★ {movie.tmdbRating.toFixed(1)}
          </Badge>
        )}
        {movie.voteCount != null && (
          <Badge variant="outline">{movie.voteCount} голосов</Badge>
        )}
        {movie.originalLanguage && (
          <Badge variant="outline">{movie.originalLanguage.toUpperCase()}</Badge>
        )}
      </Group>

      <Group gap="xs">
        {user && movie.createdById === user.id && (
          <Button component={Link} to={movieEditPath(movie.id)} variant="light">
            Редактировать
          </Button>
        )}

        <Button component={Link} to={reviewsListPath(movie.id)} variant="light">
          Отзывы {movie.reviewsCount ? ` (${movie.reviewsCount})` : ''}
        </Button>
      </Group>

      <Divider my="md"/>

      {movie.description ? (
        <Text size="md">{movie.description}</Text>
      ) : (
        <Text c="dimmed" fs="italic">
          Описание отсутствует
        </Text>
      )}

      {movie.genreIds.length > 0 && (
        <Group gap="xs" mt="lg">
          {movie.genreIds.map((genreId) => (
            <Badge key={genreId} variant="dot">
              {GENRE_NAMES[genreId] ?? `Жанр ${genreId}`}
            </Badge>
          ))}
        </Group>
      )}
    </Container>
  );
}
