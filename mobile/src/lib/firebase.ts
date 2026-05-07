import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB5FKbZ1NvQJ9DDqu44B_8eZIm0xOEaX1U',
  authDomain: 'petisco-brazil.firebaseapp.com',
  projectId: 'petisco-brazil',
  storageBucket: 'petisco-brazil.firebasestorage.app',
  messagingSenderId: '899785039409',
  appId: '1:899785039409:ios:0dc64c44ab2293d5de7f10',
};

// Track whether this is the first initialization. initializeAuth must only be
// called once per app instance — calling it again (e.g. on Fast Refresh) throws.
// On subsequent calls we fall back to getAuth which returns the existing instance.
const isFirstInit = getApps().length === 0;
const app  = isFirstInit ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = isFirstInit
  ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  : getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;
