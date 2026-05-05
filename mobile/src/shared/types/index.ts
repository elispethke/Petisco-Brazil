export type ProductCategory = 'salgado' | 'combo' | 'doce' | 'bolo';
export type PricingType = 'salgado' | 'doce' | 'combo' | 'bolo';

export interface LocalizedString {
  pt: string;
  en: string;
  de: string;
}

export interface PricingTier {
  qty: number;
  price: number; // EUR cents (total, not per unit)
  bestValue?: boolean;
}

export interface CatalogProduct {
  id: string;
  category: ProductCategory;
  pricingType: PricingType;
  image: number; // ReturnType of require()
  name: LocalizedString;
  description: LocalizedString;
}

export interface CartItem {
  product: CatalogProduct;
  qty: number;        // selected quantity from pricing tier
  totalPrice: number; // EUR cents from pricing table
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

export type Language = 'pt' | 'en' | 'de';

export interface TimeSlot {
  label: string;
  value: string;
}
