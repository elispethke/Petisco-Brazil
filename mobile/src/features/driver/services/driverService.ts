import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/** Sets the driver online/offline flag and records the last-seen timestamp. */
export async function setDriverOnlineStatus(
  driverId: string,
  online: boolean,
): Promise<void> {
  await updateDoc(doc(db, 'users', driverId), {
    isOnline: online,
    lastSeen: serverTimestamp(),
  });
}

/**
 * TODO: Live GPS tracking (Phase 6)
 * Call this on a timer (e.g. every 15 s) while driver status is "delivering".
 * Writes lat/lng to the order document so admin can track in real time.
 *
 * Implementation notes:
 *   - Use expo-location: Location.watchPositionAsync with Balanced accuracy
 *   - Only run while foreground; stop on app background to save battery
 *   - Add a Firestore composite index on (assignedDriverId, status) before enabling
 */
export async function updateDriverLocation(
  driverId: string,
  lat: number,
  lng: number,
): Promise<void> {
  await updateDoc(doc(db, 'users', driverId), {
    lat,
    lng,
    locationUpdatedAt: serverTimestamp(),
  });
}
