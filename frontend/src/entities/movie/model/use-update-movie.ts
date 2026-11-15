import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { updateMovie } from '../api/movies.api';
import type { ICreateMoviePayload } from '@the-movies/shared';
import { movieDetailPath } from '@/shared/config/routes';

export function useUpdateMovie(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: Partial<ICreateMoviePayload>) => updateMovie(id, payload),
    onSuccess: (movie) => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['movie', id] });
      notifications.show({
        title: 'Фильм обновлён',
        message: `«${movie.title}» сохранён`,
        color: 'green',
      });
      navigate(movieDetailPath(movie.id));
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить фильм',
        color: 'red',
      });
    },
  });
}
