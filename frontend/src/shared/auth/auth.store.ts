import { create } from 'zustand';
import type { IUserPublic } from '@the-movies/shared';

interface IAuthState {
  accessToken: string | null;
  user: IUserPublic | null;
  isInitialized: boolean;

  setAccessToken: (token: string | null) => void;
  setUser: (user: IUserPublic | null) => void;
  setInitialized: (value: boolean) => void;
  login: (accessToken: string, user: IUserPublic) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
  accessToken: null,
  user: null,
  isInitialized: false,

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setInitialized: (value) => set({ isInitialized: value }),

  login: (accessToken, user) => set({ accessToken, user }),

  logout: () => set({ accessToken: null, user: null }),
}));
