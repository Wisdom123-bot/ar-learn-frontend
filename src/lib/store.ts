import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  teacher_id: string;
  name: string;
  role: string;
  school_id: string;
  school_name: string;
  token?: string;
  is_premium?: boolean;
  slug?: string;
  logo_url?: string;
  id?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
