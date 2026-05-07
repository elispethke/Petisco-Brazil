import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/store/authStore';
import { getUserDoc, updateUserDoc, type AppUser } from '@/features/auth/services/userService';

export function useProfile() {
  const { user }                        = useAuthStore();
  const [profile,  setProfile]          = useState<AppUser | null>(null);
  const [loading,  setLoading]          = useState(true);
  const [error,    setError]            = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user?.uid) { setLoading(false); return; }
    try {
      setLoading(true);
      setError(null);
      const data = await getUserDoc(user.uid);
      setProfile(data);
    } catch {
      setError('Erro ao carregar perfil.');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => { fetch(); }, [fetch]);

  const update = useCallback(async (data: Partial<Omit<AppUser, 'id' | 'createdAt'>>) => {
    if (!user?.uid) return;
    await updateUserDoc(user.uid, data);
    setProfile((prev) => prev ? { ...prev, ...data } : prev);
  }, [user?.uid]);

  return { profile, loading, error, refetch: fetch, update };
}
