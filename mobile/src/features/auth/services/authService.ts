import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getOrCreateUserDoc } from './userService';

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}

export type RegisterData = {
  name:     string;
  email:    string;
  phone:    string;
  password: string;
};

export async function registerWithEmail({ name, email, phone, password }: RegisterData) {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await getOrCreateUserDoc(user.uid, user.email!, name, phone);
  return user;
}
