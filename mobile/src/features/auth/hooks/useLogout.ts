import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/shared/store/authStore';

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const { signOut: clearStore } = useAuthStore();

  const logout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Firebase terminates the session and clears AsyncStorage persistence.
      await signOut(auth);
    } catch {
      // signOut rarely fails, but even if it does we clear local state
      // so the user is not stuck in an authenticated-looking UI.
    } finally {
      // Clear Zustand state regardless of Firebase result.
      clearStore();
      // Replace prevents navigating back to a protected screen.
      router.replace('/auth/login');
      setLoading(false);
    }
  };

  return { logout, loading };
}
