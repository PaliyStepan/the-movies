import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { deleteMovie } from '../api/movies.api';
import { ERoutes } from '@/shared/config/routes';

export function useDeleteMovie(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['my-movies'] });
      notifications.show({
        title: 'Фильм удалён',
        message: 'Фильм был удалён из каталога',
        color: 'blue',
      });
      navigate(ERoutes.HOME);
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить фильм',
        color: 'red',
      });
    },
  });
}
