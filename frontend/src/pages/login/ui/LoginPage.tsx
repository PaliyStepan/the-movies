import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Title,
  Text,
  Anchor,
  Alert,
} from '@mantine/core';
import { ERoutes } from '@/shared/config/routes';
import { useLogin } from '@/features/auth/model/use-auth';

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <Stack maw={400} mx="auto" gap="md">
      <Title order={2}>Вход</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Email"
            placeholder="example@example.ru"
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordInput
            label="Пароль"
            placeholder="••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {loginMutation.isError && (
            <Alert color="red" variant="light">
              Неверный email или пароль
            </Alert>
          )}

          <Button type="submit" fullWidth loading={loginMutation.isPending}>
            Войти
          </Button>
        </Stack>
      </form>

      <Text ta="center" size="sm" c="dimmed">
        Нет аккаунта?{' '}
        <Anchor component={Link} to={ERoutes.REGISTER} size="sm">
          Зарегистрироваться
        </Anchor>
      </Text>
    </Stack>
  );
}
