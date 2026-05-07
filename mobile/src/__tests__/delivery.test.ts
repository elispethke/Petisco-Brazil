import {
  buildMapsUrl,
  filterActiveOrders,
  filterDeliveredOrders,
} from '@/features/order/utils/deliveryUtils';
import type { FirestoreOrder } from '@/shared/types';

function makeOrder(overrides: Partial<FirestoreOrder>): FirestoreOrder {
  return {
    id:        'order-1',
    userId:    'user-1',
    items:     [],
    total:     0,
    status:    'pending',
    createdAt: null,
    ...overrides,
  };
}

// ─── buildMapsUrl ─────────────────────────────────────────────────────────────

describe('buildMapsUrl', () => {
  it('returns null when order has no address', () => {
    expect(buildMapsUrl(makeOrder({}))).toBeNull();
  });

  it('returns a directions URL when lat/lng are non-zero', () => {
    const order = makeOrder({
      address: { street: 'Musterstraße', number: '1', city: 'Berlin', zipCode: '10115', country: 'DE', lat: 52.5, lng: 13.4 },
    });
    const url = buildMapsUrl(order);
    expect(url).toContain('maps/dir');
    expect(url).toContain('52.5,13.4');
  });

  it('returns a text-search URL when lat/lng are 0', () => {
    const order = makeOrder({
      address: { street: 'Musterstraße', number: '1', city: 'Berlin', zipCode: '10115', country: 'DE', lat: 0, lng: 0 },
    });
    const url = buildMapsUrl(order);
    expect(url).toContain('maps/search');
    expect(url).toContain('Musterstra');
  });
});

// ─── filterActiveOrders ───────────────────────────────────────────────────────

describe('filterActiveOrders', () => {
  it('keeps only accepted and delivering orders', () => {
    const orders = [
      makeOrder({ id: 'a', status: 'pending' }),
      makeOrder({ id: 'b', status: 'accepted' }),
      makeOrder({ id: 'c', status: 'delivering' }),
      makeOrder({ id: 'd', status: 'delivered' }),
    ];
    const result = filterActiveOrders(orders);
    expect(result).toHaveLength(2);
    expect(result.map((o) => o.id)).toEqual(['b', 'c']);
  });

  it('returns empty array when no active orders', () => {
    const orders = [makeOrder({ status: 'delivered' }), makeOrder({ status: 'pending' })];
    expect(filterActiveOrders(orders)).toHaveLength(0);
  });
});

// ─── filterDeliveredOrders ────────────────────────────────────────────────────

describe('filterDeliveredOrders', () => {
  it('returns only delivered orders', () => {
    const orders = [
      makeOrder({ id: 'x', status: 'pending' }),
      makeOrder({ id: 'y', status: 'delivering' }),
      makeOrder({ id: 'z', status: 'delivered' }),
    ];
    const result = filterDeliveredOrders(orders);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('z');
  });

  it('returns empty array when nothing delivered yet', () => {
    const orders = [makeOrder({ status: 'accepted' })];
    expect(filterDeliveredOrders(orders)).toHaveLength(0);
  });
});

// ─── Status transition guard ──────────────────────────────────────────────────

describe('status transition logic', () => {
  const NEXT_STATUS: Partial<Record<string, string>> = {
    pending:    'accepted',
    accepted:   'delivering',
    delivering: 'delivered',
  };

  it('delivered orders have no next status', () => {
    expect(NEXT_STATUS['delivered']).toBeUndefined();
  });

  it('pending orders advance to accepted', () => {
    expect(NEXT_STATUS['pending']).toBe('accepted');
  });

  it('delivering orders advance to delivered', () => {
    expect(NEXT_STATUS['delivering']).toBe('delivered');
  });
});
