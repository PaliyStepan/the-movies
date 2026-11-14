import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/auth/auth.store';
import { ERoutes } from '@/shared/config/routes';

export function PublicOnlyRoute() {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);

  if (!isInitialized) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        Загрузка...
      </div>
    );
  }

  if (user) {
    return <Navigate to={ERoutes.HOME} replace />;
  }

  return <Outlet />;
}
