import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'elispethke@gmail.com';

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}

export type RegisterData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export async function registerWithEmail({ name, email, phone, password }: RegisterData) {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);

  const role = user.email === ADMIN_EMAIL ? 'admin' : 'customer';

  await supabase.from('profiles').insert({
    id: user.uid,
    email: user.email,
    full_name: name.trim(),
    phone: phone.trim(),
    role,
  });

  return user;
}
