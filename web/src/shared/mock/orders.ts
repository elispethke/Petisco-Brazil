import { Order } from '../types';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order-001',
    userId: 'user-001',
    items: [
      {
        product: {
          id: '1',
          name: 'Combo Salgados Premium',
          description: 'Seleção artesanal',
          type: 'salgado',
          quantity: 20,
          price: 4500,
          imageUrl: '',
        },
        quantity: 1,
      },
    ],
    status: 'pending',
    scheduledDate: '2026-05-07',
    scheduledTime: '14:00',
    totalPrice: 4500,
    createdAt: '2026-05-03T10:00:00Z',
  },
  {
    id: 'order-002',
    userId: 'user-002',
    items: [
      {
        product: {
          id: '6',
          name: 'Combo Misto Completo',
          description: '10 salgados + 10 doces',
          type: 'misto',
          quantity: 20,
          price: 5500,
          imageUrl: '',
        },
        quantity: 2,
      },
    ],
    status: 'preparing',
    scheduledDate: '2026-05-08',
    scheduledTime: '16:00',
    totalPrice: 11000,
    createdAt: '2026-05-03T11:30:00Z',
  },
  {
    id: 'order-003',
    userId: 'user-003',
    items: [
      {
        product: {
          id: '5',
          name: 'Pão de Queijo Artesanal',
          description: '30 unidades',
          type: 'pao_de_queijo',
          quantity: 30,
          price: 4200,
          imageUrl: '',
        },
        quantity: 1,
      },
    ],
    status: 'delivered',
    scheduledDate: '2026-05-04',
    scheduledTime: '12:00',
    totalPrice: 4200,
    createdAt: '2026-05-01T09:00:00Z',
  },
];
