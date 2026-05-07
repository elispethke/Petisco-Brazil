import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CartItem, DeliveryAddress, FirestoreOrder, OrderItem, OrderStatus } from '@/shared/types';

const ORDERS = 'orders';

/**
 * Creates a new order. Total is always computed server-side from the items —
 * never trusting the frontend totalPrice field directly.
 */
export async function createOrder(
  userId:       string,
  cartItems:    CartItem[],
  deliveryDate: string,
  deliveryTime: string,
  address?:     DeliveryAddress,
): Promise<string> {
  const items: OrderItem[] = cartItems.map((ci) => ({
    id:       ci.product.id,
    name:     ci.product.name.pt,
    quantity: ci.qty,
    price:    ci.totalPrice,
  }));

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const ref = await addDoc(collection(db, ORDERS), {
    userId,
    items,
    total,
    status:       'pending' as OrderStatus,
    deliveryDate,
    deliveryTime,
    ...(address ? { address } : {}),
    createdAt:    serverTimestamp(),
  });

  return ref.id;
}

export async function getOrdersByUser(userId: string): Promise<FirestoreOrder[]> {
  const q    = query(
    collection(db, ORDERS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreOrder));
}

export async function getAllOrders(): Promise<FirestoreOrder[]> {
  const q    = query(collection(db, ORDERS), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreOrder));
}

/**
 * Real-time subscription for orders with status "accepted" or "delivering".
 * Used by the delivery dashboard. Returns an unsubscribe function.
 */
export function subscribeToActiveOrders(
  onUpdate: (orders: FirestoreOrder[]) => void,
): () => void {
  const q = query(
    collection(db, ORDERS),
    where('status', 'in', ['accepted', 'delivering'] as OrderStatus[]),
    orderBy('deliveryDate', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    onUpdate(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreOrder)));
  });
}

export async function updateOrderStatus(
  orderId: string,
  status:  OrderStatus,
): Promise<void> {
  await updateDoc(doc(db, ORDERS, orderId), { status });
}

/** Real-time subscription to all orders for the admin view.
 *  No orderBy — avoids Firestore index requirement. Sorted client-side. */
export function subscribeToAllOrders(
  onUpdate: (orders: FirestoreOrder[]) => void,
): () => void {
  return onSnapshot(collection(db, ORDERS), (snap) => {
    const orders = snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as FirestoreOrder))
      .sort((a, b) => {
        const ta = (a.createdAt as any)?.seconds ?? 0;
        const tb = (b.createdAt as any)?.seconds ?? 0;
        return tb - ta;
      });
    onUpdate(orders);
  });
}

/**
 * Real-time subscription to active orders assigned to a specific driver.
 * Filters status client-side to avoid requiring a composite Firestore index.
 */
export function subscribeToDriverOrders(
  driverId: string,
  onUpdate: (orders: FirestoreOrder[]) => void,
): () => void {
  const q = query(collection(db, ORDERS), where('assignedDriverId', '==', driverId));
  return onSnapshot(q, (snap) => {
    const active = snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as FirestoreOrder))
      .filter((o) => o.status === 'accepted' || o.status === 'delivering');
    onUpdate(active);
  });
}

/** Marks an order as delivered with proof photo and audit fields. */
export async function completeDelivery(
  orderId:       string,
  driverId:      string,
  proofImageUrl: string,
): Promise<void> {
  await updateDoc(doc(db, ORDERS, orderId), {
    status:        'delivered' as OrderStatus,
    deliveredAt:   serverTimestamp(),
    deliveredBy:   driverId,
    proofImageUrl,
  });
}

/**
 * Real-time subscription to delivered orders assigned to a specific driver.
 * Used for the driver's delivery history tab.
 */
export function subscribeToDriverDeliveryHistory(
  driverId: string,
  onUpdate: (orders: FirestoreOrder[]) => void,
): () => void {
  const q = query(collection(db, ORDERS), where('assignedDriverId', '==', driverId));
  return onSnapshot(q, (snap) => {
    const delivered = snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as FirestoreOrder))
      .filter((o) => o.status === 'delivered')
      .sort((a, b) => {
        const ta = (a.deliveredAt as any)?.seconds ?? 0;
        const tb = (b.deliveredAt as any)?.seconds ?? 0;
        return tb - ta;
      });
    onUpdate(delivered);
  });
}

/** Assign a driver to an order and set status to "accepted". */
export async function assignDriver(
  orderId:  string,
  driverId: string,
): Promise<void> {
  if (!orderId || !driverId) throw new Error('orderId and driverId are required');
  await updateDoc(doc(db, ORDERS, orderId), {
    assignedDriverId: driverId,
    status:           'accepted' as OrderStatus,
  });
}
