import { create } from 'zustand';
import { CartItem, CatalogProduct } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: CatalogProduct, qty: number, totalPrice: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],

  addItem: (product: CatalogProduct, qty: number, totalPrice: number) => {
    set((state) => ({
      items: [...state.items, { product, qty, totalPrice }],
    }));
  },

  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((acc, i) => acc + i.qty, 0),

  totalPrice: () => get().items.reduce((acc, i) => acc + i.totalPrice, 0),
}));
