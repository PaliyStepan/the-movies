import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuthStore} from '@/shared/auth/auth.store';
import {ERoutes} from '@/shared/config/routes';

export function ProtectedRoute() {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ERoutes.LOGIN} state={{from: location}} replace/>;
  }

  return <Outlet/>;
}
