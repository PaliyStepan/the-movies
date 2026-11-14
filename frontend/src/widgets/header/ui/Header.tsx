import { Link } from 'react-router-dom';
import { Button, Group, Container, Text, Anchor } from '@mantine/core';
import { useAuthStore } from '@/shared/auth/auth.store';
import { ERoutes } from '@/shared/config/routes';

export function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      <Container size="lg" h={64}>
        <Group justify="space-between" h="100%">
          <Anchor component={Link} to={ERoutes.HOME} underline="never">
            <Text size="xl" fw={700} c="dark">
              TheMovies
            </Text>
          </Anchor>

          <Group gap="sm">
            {user ? (
              <Button variant="outline">Выйти</Button>
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
