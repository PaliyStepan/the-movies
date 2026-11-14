import { Outlet } from 'react-router-dom';
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
