import {Link} from 'react-router-dom';
import {Card, Image, Text, Badge, Group} from '@mantine/core';
import type {IMovie} from '@the-movies/shared';
import {movieDetailPath} from '@/shared/config/routes';
import {getPosterUrl} from "@/entities/movie/lib/poster.ts";

export function MovieCard({movie}: { movie: IMovie }) {
  const poster = getPosterUrl(movie);

  return (
    <Card
      component={Link}
      to={movieDetailPath(movie.id)}
      padding="sm"
      radius="md"
      withBorder
      style={{textDecoration: 'none', height: '100%'}}
    >
      <Card.Section>
        <Image
          src={poster ?? undefined}
          alt={movie.title}
          height={300}
          fallbackSrc="no-photo.jpg"
          style={{height: '300px'}}
        />
      </Card.Section>

      <Group justify="space-between" mt="sm" wrap="nowrap">
        <Text fw={600} lineClamp={2} size="sm">
          {movie.title}
        </Text>
        {movie.year && (
          <Badge variant="light" style={{flexShrink: 0}}>
            {movie.year}
          </Badge>
        )}
      </Group>

      {movie.tmdbRating != null && (
        <Text size="xs" c="dimmed" mt={4}>
          ★ {movie.tmdbRating.toFixed(1)}
        </Text>
      )}
    </Card>
  );
}
