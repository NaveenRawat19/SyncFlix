import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await authApi.login({ email, password });
        localStorage.setItem('sf_token', res.access_token);
        set({ user: res.user, token: res.access_token, isAuthenticated: true });
      },

      register: async (username, email, password) => {
        const res = await authApi.register({ username, email, password });
        localStorage.setItem('sf_token', res.access_token);
        set({ user: res.user, token: res.access_token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('sf_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'sf-auth',
      partialise: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    } as any
  )
);
