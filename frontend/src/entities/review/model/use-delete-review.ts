import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { deleteReview } from '../api/reviews.api';
import { reviewsListPath } from '@/shared/config/routes';

export function useDeleteReview(id: string, movieId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      notifications.show({
        title: 'Отзыв удалён',
        message: 'Отзыв был удалён',
        color: 'blue',
      });
      navigate(reviewsListPath(movieId));
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить отзыв',
        color: 'red',
      });
    },
  });
}
