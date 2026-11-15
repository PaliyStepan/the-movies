import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { createMovie } from '../api/movies.api';
import type { ICreateMoviePayload } from '@the-movies/shared';
import { movieDetailPath } from '@/shared/config/routes';

export function useCreateMovie() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ICreateMoviePayload) => createMovie(payload),
    onSuccess: (movie) => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      notifications.show({
        title: 'Фильм создан',
        message: `«${movie.title}» добавлен в каталог`,
        color: 'green',
      });
      navigate(movieDetailPath(movie.id));
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать фильм',
        color: 'red',
      });
    },
  });
}
