import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { updateReview } from '../api/reviews.api';
import type { IUpdateReviewPayload } from '@the-movies/shared';
import { reviewDetailPath } from '@/shared/config/routes';

export function useUpdateReview(id: string, movieId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: IUpdateReviewPayload) => updateReview(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', id] });
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
      notifications.show({
        title: 'Отзыв обновлён',
        message: 'Изменения сохранены',
        color: 'green',
      });
      navigate(reviewDetailPath(id));
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить отзыв',
        color: 'red',
      });
    },
  });
}
