import { useEffect } from 'react';
import { useAuthStore } from '@/shared/auth/auth.store';
import { refresh, getMe } from '@/shared/api/auth.api';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { accessToken } = await refresh();
        if (cancelled) return;

        useAuthStore.getState().setAccessToken(accessToken);
        const user = await getMe();
        if (cancelled) return;

        useAuthStore.getState().setUser(user);
      } catch {
        // refresh не удался — гость, ничего не делаем
      } finally {
        if (!cancelled) {
          useAuthStore.getState().setInitialized(true);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
