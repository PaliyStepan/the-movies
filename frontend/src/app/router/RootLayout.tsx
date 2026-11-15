import {Outlet, useRouteError} from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';

export function RootLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}

export function RootError() {
  const error = useRouteError();
  console.error('Route error:', error);
  return (
    <div style={{ padding: 20 }}>
      <h1>Ошибка</h1>
      <pre>{error instanceof Error ? `${error.message}\n${error.stack}` : String(error)}</pre>
    </div>
  );
}
