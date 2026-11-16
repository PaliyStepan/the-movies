import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { changePassword } from '@/shared/api/auth.api';
import type { IChangePasswordPayload } from '@the-movies/shared';

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: IChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      notifications.show({
        title: 'Пароль изменён',
        message: 'Новый пароль сохранён',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось изменить пароль. Проверьте текущий пароль.',
        color: 'red',
      });
    },
  });
}
