jest.mock('@/lib/firebase', () => ({ db: {}, auth: {} }));
jest.mock('firebase/firestore', () => ({}));

import { useAuthStore } from '@/shared/store/authStore';
import type { AuthUser } from '@/shared/store/authStore';

const CUSTOMER: AuthUser = {
  uid:    'uid-customer',
  email:  'test@example.com',
  role:   'customer',
  status: 'approved',
};

const DRIVER_PENDING: AuthUser = {
  uid:    'uid-driver',
  email:  'driver@example.com',
  role:   'driver',
  status: 'pending',
};

describe('authStore', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useAuthStore.setState({ user: null, isLoading: true });
  });

  it('starts with user null and isLoading true', () => {
    const { user, isLoading } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isLoading).toBe(true);
  });

  it('setUser stores the user and clears loading', () => {
    useAuthStore.getState().setUser(CUSTOMER);
    const { user, isLoading } = useAuthStore.getState();
    expect(user).toEqual(CUSTOMER);
    expect(isLoading).toBe(false);
  });

  it('setUser(null) clears the user', () => {
    useAuthStore.getState().setUser(CUSTOMER);
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('signOut clears user', () => {
    useAuthStore.getState().setUser(CUSTOMER);
    useAuthStore.getState().signOut();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('stores driver with pending status correctly', () => {
    useAuthStore.getState().setUser(DRIVER_PENDING);
    const { user } = useAuthStore.getState();
    expect(user?.role).toBe('driver');
    expect(user?.status).toBe('pending');
  });

  it('setLoading updates isLoading independently', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });
});
