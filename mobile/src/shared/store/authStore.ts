import { create } from 'zustand';
import type { UserRole, UserStatus } from '@/features/auth/services/userService';

export type { UserRole, UserStatus };

export interface AuthUser {
  uid:    string;
  email:  string | null;
  role:   UserRole;
  status: UserStatus;
}

interface AuthState {
  user:       AuthUser | null;
  isLoading:  boolean;
  setUser:    (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  signOut:    () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user:       null,
  isLoading:  true,
  setUser:    (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut:    () => set({ user: null }),
}));
