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
  Divider, Button, Grid,
  Card,
} from '@mantine/core';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  addMovieToFavorites,
  getMovieById,
  getMovieFavoriteStatus,
  getMovieRecommendations,
  removeMovieFromFavorites,
} from '@/entities/movie';
import {getPosterUrl, getBackdropUrl} from '@/entities/movie/lib/poster';
import {
  ERoutes,
  movieDetailPath,
  movieEditPath,
  reviewsListPath,
} from '@/shared/config/routes';
import {GENRE_NAMES} from '@/entities/movie/lib/genres';
import {useAuthStore} from "@/shared/auth/auth.store.ts";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function MovieDetailPage() {
  const {id} = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const {data: movie, isPending, isError} = useQuery({
    queryKey: ['movie', id],
    queryFn: ({signal}) => getMovieById(id!, signal),
    enabled: !!id,
  });

  const {
    data: recommendations,
  } = useQuery({
    queryKey: ['movie-recommendations', id],
    queryFn: ({signal}) => getMovieRecommendations(id!, signal),
    enabled: !!movie,
  });

  const {
    data: favoriteStatus,
    isPending: favoriteStatusPending,
    isError: favoriteStatusError,
  } = useQuery({
    queryKey: ['movie-favorite', user?.id, id],
    queryFn: ({signal}) => getMovieFavoriteStatus(id!, signal),
    enabled: !!user && !!id,
  });

  const favoriteMutation = useMutation({
    mutationFn: (isFavorite: boolean) =>
      isFavorite
        ? removeMovieFromFavorites(id!)
        : addMovieToFavorites(id!),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({queryKey: ['movie-favorite', user?.id, id]}),
        queryClient.invalidateQueries({queryKey: ['my-favorites']}),
      ]);
    },
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
    <Container size="md" pb={"xl"}>
      <Anchor component={Link} to={ERoutes.HOME} size="sm" mb="md" display="block">
        ← Назад к фильмам
      </Anchor>


      <Grid>
        <Grid.Col span={{base: 12, md: 4}}>
          <Image
            src={image}
            alt={movie.title}
            radius="md"
            mb="lg"
            h={500}
            fit="cover"
            fallbackSrc="/no-photo.jpg"
            style={{objectPosition: 'top'}}
          />
        </Grid.Col>

        <Grid.Col span={{base: 12, md: 8}}>
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
            {user && favoriteStatus && (
              <Button
                variant={favoriteStatus?.isFavorite ? 'filled' : 'light'}
                loading={favoriteStatusPending || favoriteMutation.isPending}
                disabled={favoriteStatusError}
                onClick={() =>
                  favoriteMutation.mutate(favoriteStatus?.isFavorite ?? false)
                }
              >
                {favoriteStatus?.isFavorite
                  ? 'Удалить из избранных'
                  : 'Добавить в избранное'}
              </Button>
            )}

            {user && movie.createdById === user.id && (
              <Button component={Link} to={movieEditPath(movie.id)} variant="light">
                Редактировать
              </Button>
            )}

            <Button component={Link} to={reviewsListPath(movie.id)} variant="light">
              Отзывы {movie.reviewsCount ? ` (${movie.reviewsCount})` : ''}
            </Button>
          </Group>

          {favoriteMutation.isError && (
            <Alert color="red" mt="sm">
              Не удалось обновить избранное. Попробуйте ещё раз.
            </Alert>
          )}
          {favoriteStatusError && (
            <Alert color="red" mt="sm">
              Не удалось проверить состояние избранного.
            </Alert>
          )}

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
        </Grid.Col>
      </Grid>

      {recommendations && recommendations.length > 0 && (
        <>
          <Divider my="xl"/>

          <Title order={2} mb="md">
            Рекомендуем
          </Title>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{clickable: true}}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              576: {slidesPerView: 2},
              768: {slidesPerView: 3},
              1200: {slidesPerView: 4},
            }}
          >
            {recommendations.map((recommendation) => (
              <SwiperSlide key={recommendation.id}>
                <Card
                  component={Link}
                  to={movieDetailPath(recommendation.id)}
                  withBorder
                  padding="sm"
                  mb="xl"
                  style={{height: '360px', textDecoration: 'none'}}
                >
                  <Image
                    src={getPosterUrl(recommendation)}
                    alt={recommendation.title}
                    h={240}
                    fit="cover"
                    fallbackSrc="/no-photo.jpg"
                    radius="sm"
                    mb="sm"
                  />
                  <Text fw={600} lineClamp={2}>
                    {recommendation.title}
                  </Text>
                  <Group justify="space-between" mt="auto" pt={"xs"}>
                    {recommendation.year && (
                      <Text size="sm" c="dimmed">
                        {recommendation.year}
                      </Text>
                    )}
                    {recommendation.tmdbRating != null && (
                      <Badge color="yellow" variant="light">
                        ★ {recommendation.tmdbRating.toFixed(1)}
                      </Badge>
                    )}
                  </Group>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </Container>
  );
}
