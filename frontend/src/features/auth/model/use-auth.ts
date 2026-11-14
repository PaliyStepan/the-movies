import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/auth/auth.store';
import { ERoutes } from '@/shared/config/routes';
import { notifications } from '@mantine/notifications';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getMe,
} from '@/shared/api/auth.api';
import type { ILoginPayload, IRegisterPayload } from '@the-movies/shared';

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ILoginPayload) => {
      const { accessToken } = await loginApi(payload);
      useAuthStore.getState().setAccessToken(accessToken);
      const user = await getMe();
      return { accessToken, user };
    },
    onSuccess: ({ accessToken, user }) => {
      login(accessToken, user);
      queryClient.invalidateQueries();
      notifications.show({
        title: 'Добро пожаловать!',
        message: `Вы вошли как ${user.name}`,
        color: 'green',
      });
      navigate(ERoutes.HOME);
    },
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IRegisterPayload) => {
      const { accessToken } = await registerApi(payload);
      return { accessToken };
    },
    onSuccess: async ({ accessToken }) => {
      useAuthStore.getState().setAccessToken(accessToken);
      const user = await getMe();
      login(accessToken, user);
      queryClient.invalidateQueries();
      notifications.show({
        title: 'Аккаунт создан',
        message: 'Регистрация прошла успешно. Добро пожаловать!',
        color: 'green',
      });
      navigate(ERoutes.HOME);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout();
      queryClient.clear();
      notifications.show({
        title: 'Вы вышли',
        message: 'До новых встреч!',
        color: 'blue',
      });
      navigate(ERoutes.LOGIN);
    },
  });
}
