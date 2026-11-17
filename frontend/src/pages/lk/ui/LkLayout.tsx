import { NavLink, Outlet } from 'react-router-dom';
import { Container, Grid, NavLink as MantineNavLink, Paper, Stack, Title } from '@mantine/core';
import { ERoutes } from '@/shared/config/routes';

const menuItems = [
  { label: 'Общая информация', to: ERoutes.LK, end: true },
  { label: 'Ревью', to: ERoutes.LK_REVIEWS, end: false },
  { label: 'Фильмы', to: ERoutes.LK_MOVIES, end: false },
  { label: 'Избранное', to: ERoutes.LK_FAVORITES, end: false },
];

export function LkLayout() {
  return (
    <Container size="lg" py="md">
      <Title order={2} mb="md">
        Личный кабинет
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="xs">
            <Stack gap={4}>
              {menuItems.map((item) => (
                <MantineNavLink
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  end={item.end}
                  label={item.label}
                />
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
