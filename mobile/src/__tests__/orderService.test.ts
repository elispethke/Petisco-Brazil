import type { CartItem } from '@/shared/types';

// Mock firebase/firestore before importing orderService
const mockAddDoc = jest.fn();
const mockServerTimestamp = jest.fn(() => ({ seconds: 1234567890 }));
const mockCollection = jest.fn();

jest.mock('firebase/firestore', () => ({
  collection:      mockCollection,
  addDoc:          mockAddDoc,
  getDocs:         jest.fn(),
  query:           jest.fn(),
  where:           jest.fn(),
  orderBy:         jest.fn(),
  onSnapshot:      jest.fn(),
  doc:             jest.fn(),
  updateDoc:       jest.fn(),
  serverTimestamp: mockServerTimestamp,
}));

jest.mock('@/lib/firebase', () => ({
  db: {},
  auth: {},
}));

import { createOrder } from '@/features/order/services/orderService';

const SAMPLE_ITEMS: CartItem[] = [
  {
    product: {
      id: 'p1',
      category: 'salgado',
      pricingType: 'salgado',
      image: 0,
      name: { pt: 'Coxinha', en: 'Coxinha', de: 'Coxinha' },
      description: { pt: '', en: '', de: '' },
    },
    qty: 10,
    totalPrice: 2500, // 25.00 EUR in cents
  },
  {
    product: {
      id: 'p2',
      category: 'doce',
      pricingType: 'doce',
      image: 0,
      name: { pt: 'Brigadeiro', en: 'Brigadeiro', de: 'Brigadeiro' },
      description: { pt: '', en: '', de: '' },
    },
    qty: 20,
    totalPrice: 3000, // 30.00 EUR in cents
  },
];

describe('createOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddDoc.mockResolvedValue({ id: 'order-abc-123' });
  });

  it('returns the new order id on success', async () => {
    const id = await createOrder('user-1', SAMPLE_ITEMS, '2026-05-15', '14:00');
    expect(id).toBe('order-abc-123');
  });

  it('computes total correctly from cart items', async () => {
    await createOrder('user-1', SAMPLE_ITEMS, '2026-05-15', '14:00');
    const [, docData] = mockAddDoc.mock.calls[0];
    // 2500 + 3000 = 5500 cents
    expect(docData.total).toBe(5500);
  });

  it('maps cart items to serializable OrderItems', async () => {
    await createOrder('user-1', SAMPLE_ITEMS, '2026-05-15', '14:00');
    const [, docData] = mockAddDoc.mock.calls[0];
    expect(docData.items).toEqual([
      { id: 'p1', name: 'Coxinha', quantity: 10, price: 2500 },
      { id: 'p2', name: 'Brigadeiro', quantity: 20, price: 3000 },
    ]);
  });

  it('sets status to "pending" on creation', async () => {
    await createOrder('user-1', SAMPLE_ITEMS, '2026-05-15', '14:00');
    const [, docData] = mockAddDoc.mock.calls[0];
    expect(docData.status).toBe('pending');
  });

  it('includes userId, deliveryDate, deliveryTime in the document', async () => {
    await createOrder('user-xyz', SAMPLE_ITEMS, '2026-06-01', '10:00');
    const [, docData] = mockAddDoc.mock.calls[0];
    expect(docData.userId).toBe('user-xyz');
    expect(docData.deliveryDate).toBe('2026-06-01');
    expect(docData.deliveryTime).toBe('10:00');
  });

  it('throws when addDoc rejects', async () => {
    mockAddDoc.mockRejectedValue(new Error('Firestore unavailable'));
    await expect(
      createOrder('user-1', SAMPLE_ITEMS, '2026-05-15', '14:00'),
    ).rejects.toThrow('Firestore unavailable');
  });
});
