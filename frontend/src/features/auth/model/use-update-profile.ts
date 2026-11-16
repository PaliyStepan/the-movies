import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { updateProfile } from '@/shared/api/auth.api';
import { useAuthStore } from '@/shared/auth/auth.store';
import type { IUpdateProfilePayload } from '@the-movies/shared';

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: IUpdateProfilePayload) => updateProfile(payload),
    onSuccess: (user) => {
      setUser(user);
      notifications.show({
        title: 'Профиль обновлён',
        message: 'Изменения сохранены',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить профиль',
        color: 'red',
      });
    },
  });
}
