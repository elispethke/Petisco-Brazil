import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyB5FKbZ1NvQJ9DDqu44B_8eZIm0xOEaX1U',
  authDomain: 'petisco-brazil.firebaseapp.com',
  projectId: 'petisco-brazil',
  storageBucket: 'petisco-brazil.firebasestorage.app',
  messagingSenderId: '899785039409',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:899785039409:ios:0dc64c44ab2293d5de7f10',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export default app;
