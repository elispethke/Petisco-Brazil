import type { FirestoreOrder } from '@/shared/types';

export function buildMapsUrl(order: FirestoreOrder): string | null {
  const { address } = order;
  if (!address) return null;
  if (address.lat && address.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${address.lat},${address.lng}`;
  }
  const query = encodeURIComponent(
    `${address.street} ${address.number}, ${address.zipCode} ${address.city}`,
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function filterActiveOrders(orders: FirestoreOrder[]): FirestoreOrder[] {
  return orders.filter((o) => o.status === 'accepted' || o.status === 'delivering');
}

export function filterDeliveredOrders(orders: FirestoreOrder[]): FirestoreOrder[] {
  return orders.filter((o) => o.status === 'delivered');
}
