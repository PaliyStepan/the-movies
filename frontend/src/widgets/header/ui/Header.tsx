import { Link } from 'react-router-dom';
import { Button, Group, Container, Text, Anchor } from '@mantine/core';
import { useAuthStore } from '@/shared/auth/auth.store';
import { ERoutes } from '@/shared/config/routes';
import { useLogout } from '@/features/auth/model/use-auth';

export function Header() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const logoutMutation = useLogout();

  return (
    <header style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      <Container size="lg" py="md">
        <Group justify="space-between" h="100%">
          <Anchor component={Link} to={ERoutes.HOME} underline="never">
            <Text size="xl" fw={700} c="dark">TheMovies</Text>
          </Anchor>

          <Group gap="sm">
            {!isInitialized ? null : user ? (
              <>
                <Button component={Link} to={ERoutes.MOVIE_CREATE} variant="light">
                  Создать фильм
                </Button>
                <Button variant="outline" onClick={() => logoutMutation.mutate()} loading={logoutMutation.isPending}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to={ERoutes.LOGIN} variant="subtle">
                  Войти
                </Button>
                <Button component={Link} to={ERoutes.REGISTER}>
                  Зарегистрироваться
                </Button>
              </>
            )}
          </Group>
        </Group>
      </Container>
    </header>
  );
}
