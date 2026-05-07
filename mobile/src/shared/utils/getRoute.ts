import type { AuthUser } from '@/shared/store/authStore';

export function getRoute(user: AuthUser | null): string {
  if (!user) return '/auth/login';
  if (user.role === 'admin') return '/admin';
  if (user.role === 'driver' && user.status === 'pending') return '/auth/pending';
  if (user.role === 'driver') return '/delivery';
  return '/(tabs)';
}
