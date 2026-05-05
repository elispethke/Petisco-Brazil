import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

export const ADMIN_EMAIL = 'elispethke@gmail.com';
export const ALLOWED_ROLES = ['admin', 'production'] as const;

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return email === ADMIN_EMAIL;
}
