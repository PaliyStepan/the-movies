import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Alert,
  Button,
  Divider,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useAuthStore } from '@/shared/auth/auth.store';
import { useUpdateProfile } from '@/features/auth/model/use-update-profile';
import { useChangePassword } from '@/features/auth/model/use-change-password';

const profileSchema = z.object({
  name: z.string().min(1, 'Введите имя').max(100, 'Максимум 100 символов'),
  lastName: z.string().max(100, 'Максимум 100 символов').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Минимум 6 символов'),
    newPassword: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(6, 'Минимум 6 символов'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function LkInfoPage() {
  const user = useAuthStore((s) => s.user);
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      lastName: user?.lastName ?? '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        lastName: user.lastName ?? '',
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate({
      name: data.name,
      lastName: data.lastName || undefined,
    });
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    changePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => passwordForm.reset(),
      },
    );
  };

  if (!user) return null;

  return (
    <Stack gap="lg">
      <Title order={3}>Общая информация</Title>

      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
        <Stack gap="sm" maw={400}>
          <TextInput
            label="Email"
            value={user.email}
            disabled
          />
          <TextInput
            label="Имя"
            placeholder="Иван"
            error={profileForm.formState.errors.name?.message}
            withAsterisk
            {...profileForm.register('name')}
          />
          <TextInput
            label="Фамилия"
            placeholder="Иванов"
            error={profileForm.formState.errors.lastName?.message}
            {...profileForm.register('lastName')}
          />

          {updateProfileMutation.isError && (
            <Alert color="red" variant="light">
              Не удалось обновить профиль
            </Alert>
          )}

          <Button
            type="submit"
            loading={updateProfileMutation.isPending}
            w="fit-content"
          >
            Сохранить
          </Button>
        </Stack>
      </form>

      <Divider />

      <Title order={4}>Сменить пароль</Title>

      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
        <Stack gap="sm" maw={400}>
          <PasswordInput
            label="Текущий пароль"
            error={passwordForm.formState.errors.currentPassword?.message}
            withAsterisk
            {...passwordForm.register('currentPassword')}
          />
          <PasswordInput
            label="Новый пароль"
            error={passwordForm.formState.errors.newPassword?.message}
            withAsterisk
            {...passwordForm.register('newPassword')}
          />
          <PasswordInput
            label="Повторите новый пароль"
            error={passwordForm.formState.errors.confirmPassword?.message}
            withAsterisk
            {...passwordForm.register('confirmPassword')}
          />

          {changePasswordMutation.isError && (
            <Alert color="red" variant="light">
              Не удалось изменить пароль. Проверьте текущий пароль.
            </Alert>
          )}

          <Button
            type="submit"
            loading={changePasswordMutation.isPending}
            w="fit-content"
          >
            Сменить пароль
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
