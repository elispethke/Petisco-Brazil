import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type UserRole   = 'customer' | 'driver' | 'admin';
export type UserStatus = 'pending'  | 'approved' | 'blocked';

export interface AppUser {
  id:              string;
  name:            string;
  email:           string;
  role:            UserRole;
  status:          UserStatus;
  phone?:          string;
  address?:        string;
  photoUrl?:       string;
  vehicleType?:    'car' | 'motorcycle' | 'bicycle';
  plateNumber?:    string;
  isOnline:        boolean;
  totalDeliveries: number;
  createdAt:       unknown; // Firestore Timestamp
}

const ADMIN_EMAIL = 'elispethke@gmail.com';

function buildNewUser(uid: string, email: string, name?: string, phone?: string) {
  const role: UserRole = email === ADMIN_EMAIL ? 'admin' : 'customer';
  return {
    id:              uid,
    name:            name?.trim() || email.split('@')[0],
    email,
    role,
    status:          'approved' as UserStatus,
    phone:           phone?.trim() ?? '',
    address:         '',
    isOnline:        false,
    totalDeliveries: 0,
    createdAt:       serverTimestamp(),
  };
}

/** Fetches the doc; creates it with defaults if missing. */
export async function getOrCreateUserDoc(
  uid:    string,
  email:  string,
  name?:  string,
  phone?: string,
): Promise<AppUser> {
  const ref  = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as AppUser;
  const userData = buildNewUser(uid, email, name, phone);
  await setDoc(ref, userData);
  return userData as AppUser;
}

/** Fetches the doc; returns null if it doesn't exist. */
export async function getUserDoc(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as AppUser) : null;
}

/** Partially updates a user document. */
export async function updateUserDoc(
  uid:  string,
  data: Partial<Omit<AppUser, 'id' | 'createdAt'>>,
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data as Record<string, unknown>);
}

/** Real-time subscription to all users with role = "driver". */
export function subscribeToDrivers(
  onUpdate: (drivers: AppUser[]) => void,
): () => void {
  const q = query(collection(db, 'users'), where('role', '==', 'driver'));
  return onSnapshot(q, (snap) => {
    onUpdate(snap.docs.map((d) => d.data() as AppUser));
  });
}

/** Approve or block a driver. */
export async function updateUserStatus(uid: string, status: UserStatus): Promise<void> {
  await updateUserDoc(uid, { status });
}

/** Transitions a customer to driver (status = pending). */
export async function becomeDriver(
  uid:         string,
  vehicleType: NonNullable<AppUser['vehicleType']>,
  plateNumber?: string,
  phone?:       string,
): Promise<void> {
  await updateUserDoc(uid, {
    role:        'driver',
    status:      'pending',
    vehicleType,
    plateNumber: plateNumber?.trim() ?? '',
    ...(phone ? { phone: phone.trim() } : {}),
  });
}
