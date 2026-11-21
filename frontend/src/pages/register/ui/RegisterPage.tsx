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
import { useRegister } from '@/features/auth/model/use-auth';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Имя должно быть не менее 2 символов')
      .max(50, 'Имя должно быть не более 50 символов'),
    email: z
      .string()
      .email('Введите корректный email')
      .max(50, 'Email должен быть не более 50 символов'),
    password: z
      .string()
      .min(6, 'Пароль должен быть не менее 6 символов')
      .max(20, 'Пароль должен быть не более 20 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Stack maw={400} mx="auto" gap="md">
      <Title order={2}>Регистрация</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Имя"
            placeholder="Ваше имя"
            error={errors.name?.message}
            maxLength={50}
            {...register('name')}
          />

          <TextInput
            label="Email"
            placeholder="example@example.ru"
            maxLength={50}
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordInput
            label="Пароль"
            placeholder="••••••"
            minLength={6}
            maxLength={20}
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordInput
            label="Повторите пароль"
            placeholder="••••••"
            minLength={6}
            maxLength={20}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {registerMutation.isError && (
            <Alert color="red" variant="light">
              Пользователь с таким email уже существует
            </Alert>
          )}

          <Button type="submit" fullWidth loading={registerMutation.isPending}>
            Зарегистрироваться
          </Button>
        </Stack>
      </form>

      <Text ta="center" size="sm" c="dimmed">
        Уже есть аккаунт?{' '}
        <Anchor component={Link} to={ERoutes.LOGIN} size="sm">
          Войти
        </Anchor>
      </Text>
    </Stack>
  );
}
