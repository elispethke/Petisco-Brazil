export type ProductType = 'salgado' | 'doce' | 'misto' | 'pao_de_queijo';

export interface Product {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'delivered';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  scheduledDate: string;
  scheduledTime: string;
  totalPrice: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}
