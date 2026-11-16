import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { createReview } from '../api/reviews.api';
import type { ICreateReviewPayload } from '@the-movies/shared';
import { reviewDetailPath } from '@/shared/config/routes';

export function useCreateReview(movieId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ICreateReviewPayload) => createReview(movieId, payload),
    onSuccess: (review) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
      notifications.show({
        title: 'Отзыв создан',
        message: 'Ваш отзыв опубликован',
        color: 'green',
      });
      navigate(reviewDetailPath(review.id));
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать отзыв',
        color: 'red',
      });
    },
  });
}
