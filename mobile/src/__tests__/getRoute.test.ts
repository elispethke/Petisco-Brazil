jest.mock('@/lib/firebase', () => ({ db: {}, auth: {} }));
jest.mock('firebase/firestore', () => ({}));

import { getRoute } from '@/shared/utils/getRoute';
import type { AuthUser } from '@/shared/store/authStore';

const user = (overrides: Partial<AuthUser>): AuthUser => ({
  uid:    'uid-1',
  email:  'test@example.com',
  role:   'customer',
  status: 'approved',
  ...overrides,
});

describe('getRoute', () => {
  it('routes unauthenticated user to login', () => {
    expect(getRoute(null)).toBe('/auth/login');
  });

  it('routes admin to /admin', () => {
    expect(getRoute(user({ role: 'admin' }))).toBe('/admin');
  });

  it('routes pending driver to /auth/pending', () => {
    expect(getRoute(user({ role: 'driver', status: 'pending' }))).toBe('/auth/pending');
  });

  it('routes approved driver to /delivery', () => {
    expect(getRoute(user({ role: 'driver', status: 'approved' }))).toBe('/delivery');
  });

  it('routes blocked driver to /delivery (not pending — only pending is special-cased)', () => {
    expect(getRoute(user({ role: 'driver', status: 'blocked' }))).toBe('/delivery');
  });

  it('routes customer to /(tabs)', () => {
    expect(getRoute(user({ role: 'customer' }))).toBe('/(tabs)');
  });
});
