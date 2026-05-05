import { create } from 'zustand';
import type { User } from 'firebase/auth';

export type UserRole = 'customer' | 'delivery' | 'production' | 'admin';

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

const ADMIN_EMAIL = 'elispethke@gmail.com';

export function resolveRole(email: string | null, dbRole?: string): UserRole {
  if (email === ADMIN_EMAIL) return 'admin';
  if (dbRole === 'delivery') return 'delivery';
  if (dbRole === 'production') return 'production';
  return 'customer';
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: () => set({ user: null }),
}));
