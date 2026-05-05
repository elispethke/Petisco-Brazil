import { Order } from '../types';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order-001',
    userId: 'user-001',
    items: [
      {
        product: {
          id: 'coxinha',
          category: 'salgado',
          pricingType: 'salgado',
          image: 0,
          name: { pt: 'Coxinha', en: 'Chicken Croquette', de: 'Hähnchen Krokette' },
          description: { pt: '', en: '', de: '' },
        },
        qty: 30,
        totalPrice: 10000,
      },
    ],
    status: 'pending',
    scheduledDate: '2026-05-07',
    scheduledTime: '14:00',
    totalPrice: 10000,
    createdAt: '2026-05-03T10:00:00Z',
  },
];
